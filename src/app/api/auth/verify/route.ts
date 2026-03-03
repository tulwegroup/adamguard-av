import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request: Request) {
  try {
    // Get token from cookie
    const cookieHeader = request.headers.get('cookie');
    const tokenMatch = cookieHeader?.match(/auth_token=([^;]+)/);
    
    if (!tokenMatch) {
      return NextResponse.json(
        { authenticated: false, error: 'No session found' },
        { status: 401 }
      );
    }
    
    const token = tokenMatch[1];
    
    // Check for required JWT secret in production
    if (process.env.NODE_ENV === 'production' && !JWT_SECRET) {
      console.error('JWT_SECRET not configured in production');
      return NextResponse.json(
        { authenticated: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    const secret = JWT_SECRET || 'development-secret-not-for-production';
    
    // Verify token
    const decoded = verify(token, secret, {
      issuer: 'adamguard-pro',
      audience: 'adamguard-users'
    }) as { sub: string; sessionId: string; role: string };
    
    // Return session info
    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded.sub,
        role: decoded.role,
        sessionId: decoded.sessionId
      }
    });
    
  } catch (error) {
    // Token is invalid or expired
    if (error instanceof Error) {
      console.warn('[Security] Session verification failed:', error.message);
    }
    
    const response = NextResponse.json(
      { authenticated: false, error: 'Invalid or expired session' },
      { status: 401 }
    );
    
    // Clear invalid cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('session_id');
    
    return response;
  }
}
