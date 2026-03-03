import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in-memory for development, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMITS = {
  // General API requests
  api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  // Authentication endpoints
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  // Scan endpoints
  scan: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 scans per minute
};

// Blocked IP patterns (basic protection)
const BLOCKED_PATTERNS = [
  /\b(sql|script|exec|union|select|insert|delete|drop|update|create|alter)\b/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /\.\.\//g,
  /%2e%2e%2f/gi,
  /%252e%252e%252f/gi,
];

// Security headers configuration
const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  // Prevent MIME-type sniffing
  'X-Content-Type-Options': 'nosniff',
  // XSS protection
  'X-XSS-Protection': '1; mode=block',
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.openai.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; '),
  // Strict Transport Security (HSTS) - 1 year
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

function getClientIP(request: NextRequest): string {
  // Check for forwarded headers (from ALB/CloudFront)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Fallback to connection IP
  return request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMITS
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = RATE_LIMITS[type];
  const now = Date.now();
  const key = `${type}:${identifier}`;
  
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
  }
  
  if (record.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  // Increment count
  record.count++;
  rateLimitStore.set(key, record);
  
  return { allowed: true, remaining: config.maxRequests - record.count, resetTime: record.resetTime };
}

function detectMaliciousInput(url: string): boolean {
  const decodedUrl = decodeURIComponent(url);
  return BLOCKED_PATTERNS.some(pattern => pattern.test(decodedUrl));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);
  const response = NextResponse.next();

  // 1. Check for malicious input patterns
  if (detectMaliciousInput(pathname + request.nextUrl.search)) {
    console.warn(`[Security] Blocked malicious request from ${clientIP}: ${pathname}`);
    return new NextResponse('Bad Request', { status: 400 });
  }

  // 2. Apply rate limiting
  let rateLimitType: keyof typeof RATE_LIMITS = 'api';
  
  if (pathname.startsWith('/api/auth/')) {
    rateLimitType = 'auth';
  } else if (pathname.startsWith('/api/scans') || pathname.includes('/scan')) {
    rateLimitType = 'scan';
  }
  
  const rateLimit = checkRateLimit(clientIP, rateLimitType);
  
  if (!rateLimit.allowed) {
    console.warn(`[Security] Rate limit exceeded for ${clientIP} on ${pathname}`);
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
        'X-RateLimit-Reset': String(rateLimit.resetTime),
      },
    });
  }

  // 3. Add rate limit headers
  response.headers.set('X-RateLimit-Limit', String(RATE_LIMITS[rateLimitType].maxRequests));
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  response.headers.set('X-RateLimit-Reset', String(rateLimit.resetTime));

  // 4. Apply security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // 5. Log suspicious requests (but don't block them)
  const userAgent = request.headers.get('user-agent') || '';
  if (
    userAgent.includes('sqlmap') ||
    userAgent.includes('nikto') ||
    userAgent.includes('masscan') ||
    userAgent.includes('nmap')
  ) {
    console.warn(`[Security] Suspicious user agent from ${clientIP}: ${userAgent}`);
  }

  // 6. Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  // 7. Handle OPTIONS requests for CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

// Configure which routes to apply middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|.*\\..*|manifest.json|sw.js).*)',
  ],
};
