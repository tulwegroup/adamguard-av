import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeString, SecuritySchemas, createAuditLog } from '@/lib/security';

// Registration validation schema
const registerSchema = z.object({
  email: SecuritySchemas.email,
  password: SecuritySchemas.password,
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .transform(sanitizeString),
  role: z.enum(['viewer', 'analyst', 'admin']).default('viewer'),
  invitedBy: z.string().optional(),
  inviteToken: z.string().optional(),
});

// In-memory store for tracking registrations (use Redis in production)
const registrationAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_REGISTRATIONS_PER_IP = 5;
const REGISTRATION_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

function checkRegistrationLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = registrationAttempts.get(ip);
  
  if (!attempts) {
    registrationAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  
  // Reset if window has passed
  if (now - attempts.firstAttempt > REGISTRATION_WINDOW_MS) {
    registrationAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  
  if (attempts.count >= MAX_REGISTRATIONS_PER_IP) {
    return false;
  }
  
  attempts.count++;
  return true;
}

export async function POST(request: Request) {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    // Check registration rate limit
    if (!checkRegistrationLimit(clientIP)) {
      console.warn(`[Security] Registration rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map(i => i.message).join(', ');
      return NextResponse.json(
        { success: false, error: `Validation failed: ${errors}` },
        { status: 400 }
      );
    }
    
    const { email, password, name, role, invitedBy, inviteToken } = validation.data;
    
    // In production:
    // 1. Check if user exists in database
    // 2. Validate invite token if provided
    // 3. Hash password with bcrypt (cost factor 12+)
    // 4. Create user in database
    // 5. Send verification email with secure token
    
    // Simulate checking for existing user
    // const existingUser = await prisma.user.findUnique({ where: { email } });
    // if (existingUser) {
    //   return NextResponse.json(
    //     { success: false, error: 'An account with this email already exists' },
    //     { status: 409 }
    //   );
    // }
    
    // Validate invite token if provided
    if (invitedBy && inviteToken) {
      // In production: validate the invite token
      console.log(`[Registration] Invite registration for ${email} by ${invitedBy}`);
    }
    
    // Create audit log
    const auditLog = createAuditLog('user.register', clientIP, userAgent, {
      status: 'success',
      details: { 
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email in logs
        role,
        invitedBy 
      }
    });
    console.log('[Audit]', JSON.stringify(auditLog));
    
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      name,
      role,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      isActive: true,
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      verificationRequired: true
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Create error audit log
    const errorLog = createAuditLog('user.register.error', clientIP, userAgent, {
      status: 'failure',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    console.log('[Audit]', JSON.stringify(errorLog));
    
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
