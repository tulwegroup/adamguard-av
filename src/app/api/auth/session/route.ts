import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'adamguard-secret-key-2026';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    const decoded = verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    
    // In production, fetch user from database
    const user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.email.split('@')[0],
      avatar: decoded.email[0].toUpperCase(),
      isActive: true,
      emailVerified: true,
      twoFactorEnabled: false
    };

    return NextResponse.json({
      success: true,
      user,
      permissions: getPermissionsForRole(decoded.role)
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

function getPermissionsForRole(role: string): string[] {
  const permissions: Record<string, string[]> = {
    super_admin: ['all'],
    admin: ['dashboard', 'scan', 'quarantine', 'threats', 'analytics', 'ai', 'settings', 'team'],
    security_analyst: ['dashboard', 'scan', 'quarantine', 'threats', 'analytics', 'ai'],
    viewer: ['dashboard', 'threats', 'analytics'],
    readonly: ['dashboard']
  };
  return permissions[role] || ['dashboard'];
}
