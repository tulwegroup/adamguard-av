/**
 * Environment Variable Validation for AdamGuard Pro
 * Validates all required environment variables at startup
 */

import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  
  // Database
  DATABASE_URL: z.string().url('Invalid DATABASE_URL'),
  
  // Authentication secrets (required in production)
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters').optional(),
  NEXTAUTH_URL: z.string().url('Invalid NEXTAUTH_URL').optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
  
  // API Keys (optional)
  OPENAI_API_KEY: z.string().startsWith('sk-', 'Invalid OpenAI API key format').optional(),
  
  // Email configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email('Invalid EMAIL_FROM').optional(),
  
  // Security settings
  ALLOWED_ORIGINS: z.string().optional(),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  SESSION_MAX_AGE: z.string().transform(Number).default('86400'),
  
  // AWS Configuration (for production)
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  
  // Feature flags
  ENABLE_AI_FEATURES: z.string().transform(v => v === 'true').default('true'),
  ENABLE_ANALYTICS: z.string().transform(v => v === 'true').default('true'),
});

// Validate and export
function validateEnv() {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    result.error.issues.forEach(issue => {
      console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
    });
    
    // In production, we might want to throw or exit
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment variables');
    }
    
    return { ...process.env, _envErrors: result.error.issues };
  }
  
  return result.data;
}

export const env = validateEnv();

// Type-safe environment access
export type Env = z.infer<typeof envSchema>;

// Helper to check if running in production
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

// Security check for production
export function validateProductionEnv(): void {
  if (isProduction) {
    const missing: string[] = [];
    
    if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
      missing.push('NEXTAUTH_SECRET (min 32 chars)');
    }
    
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      missing.push('JWT_SECRET (min 32 chars)');
    }
    
    if (!process.env.DATABASE_URL) {
      missing.push('DATABASE_URL');
    }
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required production environment variables:\n${missing.map(m => `  - ${m}`).join('\n')}`
      );
    }
    
    console.log('✅ Production environment validated successfully');
  }
}
