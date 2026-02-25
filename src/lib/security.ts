/**
 * Security Utilities for AdamGuard Pro
 * Provides input validation, sanitization, and security helpers
 */

import { z } from 'zod';

// ============================================
// Input Sanitization
// ============================================

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .trim();
}

/**
 * Sanitize HTML content - removes dangerous tags and attributes
 */
export function sanitizeHtml(html: string): string {
  // Allow only safe HTML tags
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'span', 'div', 'ul', 'ol', 'li'];
  
  // Remove script tags and content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove style tags and content
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove all attributes from remaining tags except allowed ones
  sanitized = sanitized.replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
    if (!allowedTags.includes(tag.toLowerCase())) {
      return '';
    }
    // Remove all attributes
    return `<${tag}>`;
  });
  
  return sanitized;
}

/**
 * Sanitize file path to prevent directory traversal
 */
export function sanitizeFilePath(path: string): string {
  return path
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[<>:"|?*]/g, '') // Remove invalid characters
    .replace(/\/+/g, '/') // Remove multiple slashes
    .replace(/^\/+/, '') // Remove leading slashes
    .trim();
}

/**
 * Sanitize SQL-like input to prevent SQL injection
 */
export function sanitizeSqlInput(input: string): string {
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION)\b)/gi,
    /(--|#|\/\*|\*\/)/g,
    /('|")/g,
  ];
  
  let sanitized = input;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized.trim();
}

// ============================================
// Input Validation Schemas
// ============================================

export const SecuritySchemas = {
  // Email validation
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .transform(sanitizeString),
  
  // Password validation - strong password requirements
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
  
  // Username validation
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscore, and hyphen')
    .transform(sanitizeString),
  
  // File name validation
  fileName: z.string()
    .min(1, 'File name required')
    .max(255, 'File name too long')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid file name characters')
    .transform(sanitizeString),
  
  // API Key validation
  apiKey: z.string()
    .min(32, 'API key too short')
    .max(128, 'API key too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid API key format'),
  
  // License key validation
  licenseKey: z.string()
    .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Invalid license key format'),
  
  // URL validation
  url: z.string()
    .url('Invalid URL format')
    .max(2048, 'URL too long')
    .refine(url => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    }, 'Only HTTP and HTTPS URLs allowed'),
  
  // ID validation (for database IDs, etc.)
  id: z.string()
    .min(1, 'ID required')
    .max(64, 'ID too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid ID format'),
};

// ============================================
// Password Security
// ============================================

/**
 * Generate a cryptographically secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // Use crypto API for secure random generation
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  
  return result;
}

/**
 * Generate a secure session ID
 */
export function generateSessionId(): string {
  return `${Date.now().toString(36)}-${generateSecureToken(32)}`;
}

/**
 * Generate a secure CSRF token
 */
export function generateCsrfToken(): string {
  return generateSecureToken(48);
}

/**
 * Hash a value using SHA-256 (for non-password use cases)
 */
export async function hashValue(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================
// Session Security
// ============================================

export interface SecureSession {
  id: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  ipAddress: string;
  userAgent: string;
  csrfToken: string;
}

/**
 * Create a secure session object
 */
export function createSecureSession(
  userId: string,
  ipAddress: string,
  userAgent: string,
  expiresInMs: number = 24 * 60 * 60 * 1000 // 24 hours default
): SecureSession {
  return {
    id: generateSessionId(),
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + expiresInMs,
    ipAddress,
    userAgent,
    csrfToken: generateCsrfToken(),
  };
}

/**
 * Validate session is not expired
 */
export function isSessionValid(session: SecureSession): boolean {
  return Date.now() < session.expiresAt;
}

// ============================================
// Audit Logging
// ============================================

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  resourceId?: string;
  resourceType?: string;
  details?: Record<string, unknown>;
  status: 'success' | 'failure';
}

/**
 * Create an audit log entry
 */
export function createAuditLog(
  action: string,
  ipAddress: string,
  userAgent: string,
  options: {
    userId?: string;
    resourceId?: string;
    resourceType?: string;
    details?: Record<string, unknown>;
    status: 'success' | 'failure';
  }
): AuditLogEntry {
  return {
    timestamp: new Date().toISOString(),
    action,
    ipAddress,
    userAgent,
    ...options,
  };
}

// ============================================
// IP Address Utilities
// ============================================

/**
 * Check if IP is in private range
 */
export function isPrivateIP(ip: string): boolean {
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./,
    /^::1$/,
    /^fc00:/i,
    /^fe80:/i,
  ];
  
  return privateRanges.some(range => range.test(ip));
}

/**
 * Validate IP address format
 */
export function isValidIP(ip: string): boolean {
  // IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.').map(Number);
    return parts.every(part => part >= 0 && part <= 255);
  }
  
  return ipv6Regex.test(ip);
}

// ============================================
// Content Security Utilities
// ============================================

/**
 * Generate nonce for CSP
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Build CSP header value
 */
export function buildCSP(options: {
  nonce?: string;
  reportUri?: string;
  development?: boolean;
}): string {
  const { nonce, reportUri, development } = options;
  
  const directives = [
    "default-src 'self'",
    `script-src 'self'${nonce ? ` 'nonce-${nonce}'` : "'unsafe-inline'"}${development ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.openai.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ];
  
  if (reportUri) {
    directives.push(`report-uri ${reportUri}`);
  }
  
  return directives.join('; ');
}
