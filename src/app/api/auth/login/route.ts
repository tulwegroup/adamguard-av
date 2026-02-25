import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { z } from 'zod';
import { sanitizeString, SecuritySchemas, createAuditLog, generateSessionId } from '@/lib/security';

// Configuration
const JWT_SECRET = process.env.JWT_SECRET;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// In-memory store for login attempts (use Redis in production)
const loginAttempts = new Map<string, { count: number; lockoutUntil: number }>();

// Input validation schema
const loginSchema = z.object({
  email: SecuritySchemas.email,
  password: z.string().min(1, 'Password required').max(128),
});

// Mock user database - In production, use Prisma with real database
const users = [
  {
    id: '1',
    email: 'admin@adamguard.security',
    password: '$2a$10$hashedpassword', // In production, use bcrypt
    name: 'Admin User',
    role: 'super_admin',
    avatar: 'AU',
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: false,
  },
  {
    id: '2',
    email: 'analyst@adamguard.security',
    password: '$2a$10$hashedpassword',
    name: 'Security Analyst',
    role: 'security_analyst',
    avatar: 'SA',
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: false,
  },
];

// Check if account is locked
function isAccountLocked(identifier: string): { locked: boolean; remainingMs: number } {
  const attempts = loginAttempts.get(identifier);
  if (!attempts) return { locked: false, remainingMs: 0 };
  
  if (attempts.lockoutUntil > Date.now()) {
    return { locked: true, remainingMs: attempts.lockoutUntil - Date.now() };
  }
  
  return { locked: false, remainingMs: 0 };
}

// Record failed login attempt
function recordFailedAttempt(identifier: string): void {
  const attempts = loginAttempts.get(identifier) || { count: 0, lockoutUntil: 0 };
  attempts.count++;
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
  }
  
  loginAttempts.set(identifier, attempts);
}

// Reset login attempts on successful login
function resetLoginAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

// Get client IP
function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    // Check for required JWT secret in production
    if (process.env.NODE_ENV === 'production' && !JWT_SECRET) {
      console.error('JWT_SECRET not configured in production');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    const secret = JWT_SECRET || 'development-secret-not-for-production';
    
    // Parse and validate input
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password format' },
        { status: 400 }
      );
    }
    
    const { email, password } = validation.data;
    const sanitizedEmail = sanitizeString(email.toLowerCase());
    
    // Check if account is locked
    const { locked, remainingMs } = isAccountLocked(sanitizedEmail);
    if (locked) {
      console.warn(`[Security] Login attempt on locked account: ${sanitizedEmail} from ${clientIP}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Account temporarily locked. Please try again later.',
          lockoutRemaining: Math.ceil(remainingMs / 1000)
        },
        { status: 429 }
      );
    }
    
    // Find user (constant-time comparison would be better in production)
    const user = users.find(u => u.email.toLowerCase() === sanitizedEmail);
    
    // Use same error message for invalid email/password to prevent enumeration
    const invalidCredentialsError = { success: false, error: 'Invalid email or password' };
    
    if (!user) {
      // Record failed attempt even for non-existent users (prevents enumeration)
      recordFailedAttempt(sanitizedEmail);
      console.warn(`[Security] Failed login for non-existent user: ${sanitizedEmail} from ${clientIP}`);
      return NextResponse.json(invalidCredentialsError, { status: 401 });
    }
    
    // In production, verify password with bcrypt
    // const valid = await bcrypt.compare(password, user.password);
    const valid = password === 'admin123'; // Demo only - REMOVE IN PRODUCTION
    
    if (!valid) {
      recordFailedAttempt(sanitizedEmail);
      console.warn(`[Security] Failed login for user: ${sanitizedEmail} from ${clientIP}`);
      return NextResponse.json(invalidCredentialsError, { status: 401 });
    }
    
    // Check if account is active
    if (!user.isActive) {
      console.warn(`[Security] Login attempt on disabled account: ${sanitizedEmail} from ${clientIP}`);
      return NextResponse.json(
        { success: false, error: 'Account is disabled. Contact administrator.' },
        { status: 403 }
      );
    }
    
    // Reset failed attempts on successful login
    resetLoginAttempts(sanitizedEmail);
    
    // Generate session ID
    const sessionId = generateSessionId();
    
    // Generate JWT token with minimal claims
    const token = sign(
      { 
        sub: user.id, 
        sessionId,
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
      },
      secret,
      { 
        expiresIn: '24h',
        issuer: 'adamguard-pro',
        audience: 'adamguard-users'
      }
    );
    
    // Create audit log
    const auditLog = createAuditLog('user.login', clientIP, userAgent, {
      userId: user.id,
      status: 'success',
      details: { sessionId }
    });
    console.log('[Audit]', JSON.stringify(auditLog));
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      expiresIn: 86400, // 24 hours in seconds
    });
    
    // Set HTTP-only cookie for the token
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });
    
    // Set session ID cookie
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Log error for debugging
    const errorLog = createAuditLog('user.login.error', clientIP, userAgent, {
      status: 'failure',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    console.log('[Audit]', JSON.stringify(errorLog));
    
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
