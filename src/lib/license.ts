// Licensing and Tier System for AdamGuard Pro

export type LicenseTier = 'essential' | 'family' | 'business' | 'enterprise' | 'trial';

export interface License {
  id: string;
  tier: LicenseTier;
  organizationId: string;
  organizationName: string;
  adminEmail: string;
  adminName: string;
  startedAt: Date;
  expiresAt: Date | null; // null for lifetime/enterprise
  isActive: boolean;
  maxUsers: number;
  maxDevices: number;
  features: string[];
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface TrialLicense extends Omit<License, 'tier' | 'maxDevices'> {
  tier: 'trial';
  trialDays: number;
  daysRemaining: number;
  isExpired: boolean;
  maxDevices: 1;
}

export interface PaidLicense extends Omit<License, 'tier'> {
  tier: 'essential' | 'family' | 'business' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  price: number;
  seats?: number; // For enterprise
}

// Trial configuration
export const TRIAL_CONFIG = {
  durationDays: 14,
  maxUsers: 1,
  maxDevices: 1,
  features: [
    'real_time_protection',
    'quick_scan',
    'full_scan',
    'quarantine',
    'basic_analytics',
    'community_support'
  ],
  restrictedFeatures: [
    'ai_deep_scan',
    'zero_day_protection',
    'ai_agents',
    'team_management',
    'rbac',
    'email_alerts',
    'api_access',
    'priority_support',
    'custom_policies',
    'audit_logs',
    'vpn',
    'identity_monitoring',
    'dark_web_monitoring'
  ]
};

// Tier configurations
export const TIER_CONFIGS = {
  essential: {
    name: 'Essential',
    maxUsers: 1,
    maxDevices: 1,
    features: [
      'real_time_protection',
      'quick_scan',
      'full_scan',
      'quarantine',
      'basic_analytics',
      'automatic_updates',
      'community_support'
    ],
    priceMonthly: 0,
    priceYearly: 0
  },
  family: {
    name: 'Family',
    maxUsers: 6,
    maxDevices: 5,
    features: [
      'real_time_protection',
      'quick_scan',
      'full_scan',
      'custom_scan',
      'ai_deep_scan',
      'quarantine',
      'advanced_analytics',
      'ai_agents',
      'zero_day_protection',
      'behavioral_analysis',
      'child_mode',
      'grandparent_mode',
      'guest_mode',
      'screen_time_management',
      'content_filtering',
      'scam_detection',
      'anti_phishing',
      'priority_email_support',
      'family_dashboard'
    ],
    priceMonthly: 6.99,
    priceYearly: 69.99
  },
  business: {
    name: 'Business',
    maxUsers: 25,
    maxDevices: 25,
    features: [
      'everything_in_family',
      'team_management',
      'rbac',
      'centralized_policies',
      'vpn',
      'identity_monitoring',
      'dark_web_monitoring',
      'password_manager',
      'cloud_backup_100gb',
      'system_optimization',
      'advanced_firewall',
      'api_access',
      'priority_phone_support',
      'sla_99_5'
    ],
    priceMonthly: 14.99,
    priceYearly: 149.99
  },
  enterprise: {
    name: 'Enterprise',
    maxUsers: 9999,
    maxDevices: 9999,
    features: [
      'everything_in_business',
      'unlimited_devices',
      'dedicated_account_manager',
      'custom_security_policies',
      'siem_soar_integration',
      'sso_saml',
      'active_directory_sync',
      'advanced_threat_intelligence',
      'custom_ai_training',
      'on_premise_deployment',
      'data_loss_prevention',
      'endpoint_detection_response',
      'forensic_analysis',
      '24_7_premium_support',
      'sla_99_99',
      'security_audit_reports',
      'compliance_reporting'
    ],
    priceMonthly: 24.99,
    priceYearly: 249.99
  }
};

// Pricing plans for display
export const PRICING_PLANS = [
  {
    id: 'essential',
    name: 'Essential',
    tier: 'essential' as const,
    price: 0,
    period: 'forever',
    description: 'Basic protection for individuals',
    features: [
      { name: 'Real-time protection', included: true },
      { name: 'Quick & Full scans', included: true },
      { name: 'Quarantine management', included: true },
      { name: '1 device', included: true },
      { name: 'Community support', included: true },
      { name: 'AI Deep Scan', included: false },
      { name: 'Zero-day protection', included: false },
      { name: 'Team management', included: false }
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    id: 'family',
    name: 'Family',
    tier: 'family' as const,
    price: 6.99,
    period: 'month',
    yearlyPrice: 69.99,
    description: 'Complete protection for the whole family',
    features: [
      { name: 'Everything in Essential', included: true },
      { name: 'AI-powered threat detection', included: true },
      { name: 'Zero-day protection', included: true },
      { name: '4 AI Security Agents', included: true },
      { name: 'Parental controls & modes', included: true },
      { name: '5 devices', included: true },
      { name: 'Priority email support', included: true },
      { name: 'VPN & Identity monitoring', included: false }
    ],
    cta: 'Upgrade to Family',
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    tier: 'business' as const,
    price: 14.99,
    period: 'month',
    yearlyPrice: 149.99,
    description: 'Advanced security for small teams',
    features: [
      { name: 'Everything in Family', included: true },
      { name: 'Up to 25 devices', included: true },
      { name: 'Team management console', included: true },
      { name: 'VPN with 50+ locations', included: true },
      { name: 'Identity & dark web monitoring', included: true },
      { name: 'API access', included: true },
      { name: 'Priority phone support', included: true },
      { name: '99.5% SLA guarantee', included: true }
    ],
    cta: 'Upgrade to Business',
    popular: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'enterprise' as const,
    price: 24.99,
    period: 'seat/month',
    yearlyPrice: 249.99,
    description: 'Custom solutions for large organizations',
    features: [
      { name: 'Everything in Business', included: true },
      { name: 'Unlimited devices', included: true },
      { name: 'SSO/SAML authentication', included: true },
      { name: 'SIEM/SOAR integrations', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'On-premise deployment option', included: true },
      { name: '24/7 premium support', included: true },
      { name: '99.99% SLA guarantee', included: true }
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

// Helper function to check if feature is available
export function isFeatureAvailable(license: License, feature: string): boolean {
  if (license.tier === 'trial') {
    return TRIAL_CONFIG.features.includes(feature);
  }
  
  const tierConfig = TIER_CONFIGS[license.tier];
  if (!tierConfig) return false;
  
  return tierConfig.features.includes(feature) || 
         tierConfig.features.includes('everything_in_family') ||
         tierConfig.features.includes('everything_in_business');
}

// Helper to calculate trial days remaining
export function calculateTrialDaysRemaining(startedAt: Date): number {
  const now = new Date();
  const endDate = new Date(startedAt);
  endDate.setDate(endDate.getDate() + TRIAL_CONFIG.durationDays);
  
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

// Check if trial is expired
export function isTrialExpired(startedAt: Date): boolean {
  return calculateTrialDaysRemaining(startedAt) <= 0;
}

// Generate license ID
export function generateLicenseId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'AG-';
  for (let i = 0; i < 4; i++) {
    if (i > 0) result += '-';
    for (let j = 0; j < 4; j++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return result;
}

// Format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

// Get trial percentage remaining
export function getTrialPercentageRemaining(startedAt: Date): number {
  const daysRemaining = calculateTrialDaysRemaining(startedAt);
  return Math.round((daysRemaining / TRIAL_CONFIG.durationDays) * 100);
}

// Get tier display name
export function getTierDisplayName(tier: LicenseTier): string {
  switch (tier) {
    case 'trial': return 'Free Trial';
    case 'essential': return 'Essential';
    case 'family': return 'Family';
    case 'business': return 'Business';
    case 'enterprise': return 'Enterprise';
    default: return 'Unknown';
  }
}

// Get tier badge color
export function getTierBadgeColor(tier: LicenseTier): string {
  switch (tier) {
    case 'trial': return 'border-blue-500/30 text-blue-400';
    case 'essential': return 'border-gray-500/30 text-gray-400';
    case 'family': return 'border-rose-500/30 text-rose-400';
    case 'business': return 'border-blue-500/30 text-blue-400';
    case 'enterprise': return 'border-purple-500/30 text-purple-400';
    default: return 'border-gray-500/30 text-gray-400';
  }
}

// Admin/Super Admin user interface
export interface SuperAdmin {
  id: string;
  email: string;
  name: string;
  role: 'super_admin';
  licenseId: string;
  organizationId: string;
  permissions: ['all'];
  createdAt: Date;
  lastLogin: Date | null;
  isActive: boolean;
}

// Organization interface
export interface Organization {
  id: string;
  name: string;
  licenseId: string;
  adminId: string;
  users: string[];
  createdAt: Date;
  settings: {
    allowTrialExtension: boolean;
    customBranding: boolean;
    ssoEnabled: boolean;
  };
}
