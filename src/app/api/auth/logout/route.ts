import { NextResponse } from 'next/server';
import { createAuditLog } from '@/lib/security';

export async function POST(request: Request) {
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    // Get session ID from cookie for logging
    const cookieHeader = request.headers.get('cookie');
    const sessionMatch = cookieHeader?.match(/session_id=([^;]+)/);
    const sessionId = sessionMatch ? sessionMatch[1] : 'unknown';
    
    // Create audit log
    const auditLog = createAuditLog('user.logout', clientIP, userAgent, {
      status: 'success',
      details: { sessionId }
    });
    console.log('[Audit]', JSON.stringify(auditLog));
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear auth cookies
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    
    response.cookies.set('session_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still try to clear cookies on error
    const response = NextResponse.json({
      success: true,
      message: 'Logged out'
    });
    
    response.cookies.delete('auth_token');
    response.cookies.delete('session_id');
    
    return response;
  }
}
