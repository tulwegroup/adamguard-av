// Regional Pricing Engine for AdamGuard Pro
// Dynamic pricing based on purchasing power parity and regional markets

export type Region = 
  | 'north_america'
  | 'western_europe'
  | 'eastern_europe'
  | 'india'
  | 'southeast_asia'
  | 'latin_america'
  | 'middle_east'
  | 'africa'
  | 'oceania'
  | 'east_asia';

export type Currency = 
  | 'USD' | 'EUR' | 'GBP' | 'INR' | 'BRL' | 'MXN' 
  | 'AED' | 'ZAR' | 'NGN' | 'AUD' | 'JPY' | 'CNY'
  | 'KRW' | 'SGD' | 'PHP' | 'IDR' | 'THB' | 'VND'
  | 'ARS' | 'CLP' | 'COP' | 'PEN' | 'TRY' | 'PLN'
  | 'RUB' | 'EGP' | 'KES' | 'MAD' | 'SAR';

export interface RegionalPrice {
  currency: Currency;
  symbol: string;
  essentialMonthly: number;
  essentialYearly: number;
  familyMonthly: number;
  familyYearly: number;
  businessMonthly: number;
  businessYearly: number;
  enterpriseMonthly: number; // Per seat
  enterpriseYearly: number;
  exchangeRate: number; // To USD
  purchasingPowerParity: number;
  taxRate: number;
  localizedPriceString: (price: number) => string;
}

// Regional pricing configuration based on PPP and market analysis
export const REGIONAL_PRICING: Record<Region, RegionalPrice> = {
  north_america: {
    currency: 'USD',
    symbol: '$',
    essentialMonthly: 0,
    essentialYearly: 0,
    familyMonthly: 6.99,
    familyYearly: 69.99,
    businessMonthly: 14.99,
    businessYearly: 149.99,
    enterpriseMonthly: 24.99,
    enterpriseYearly: 249.99,
    exchangeRate: 1,
    purchasingPowerParity: 1,
    taxRate: 0,
    localizedPriceString: (price) => price === 0 ? 'Free' : `$${price.toFixed(2)}`
  },
  western_europe: {
    currency: 'EUR',
    symbol: '€',
    essentialMonthly: 0,
    essentialYearly: 0,
    familyMonthly: 6.99,
    familyYearly: 69.99,
    businessMonthly: 14.99,
    businessYearly: 149.99,
    enterpriseMonthly: 24.99,
    enterpriseYearly: 249.99,
    exchangeRate: 0.92,
    purchasingPowerParity: 1.05,
    taxRate: 0.20, // VAT
    localizedPriceString: (price) => price === 0 ? 'Free' : `€${price.toFixed(2)}`
  },
  eastern_europe: {
    currency: 'PLN',
    symbol: 'zł',
    essentialMonthly: 0,
    essentialYearly: 0,
    familyMonthly: 29.99,
    familyYearly: 299.99,
    businessMonthly: 59.99,
    businessYearly: 599.99,
    enterpriseMonthly: 99.99,
    enterpriseYearly: 999.99,
    exchangeRate: 4.15,
    purchasingPowerParity: 0.55,
    taxRate: 0.23,
    localizedPriceString: (price) => price === 0 ? 'Free' : `${price.toFixed(2)} zł`
  },
  india: {
    currency: 'INR',
    symbol: '₹',
    essentialMonthly: 0,
    essentialYearly: 0,
    familyMonthly: 299,
    familyYearly: 2999,
    businessMonthly: 599,
    businessYearly: 5999,
    enterpriseMonthly: 999,
    enterpriseYearly: 9999,
    exchangeRate: 83,
    purchasingPowerParity: 0.25,
    taxRate: 0.18, // GST
    localizedPriceString: (price) => price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`
  },
  southeast_asia: {
    currency: 'SGD',
    symbol: 'S$',
    essentialMonthly: 0,
    essentialYearly: 0,
    familyMonthly: 9.49,
    familyYearly: 94.99,
    businessMonthly: 18.99,
    businessYearly: 189.99,
    enterpriseMonthly: 32.99,
    enterpriseYearly: 329.99,
    exchangeRate: 1.35,
    purchasingPowerParity: 0.85,
    taxRate: 0.08, // GST
    localizedPriceString: (price) => price === 0 ? 'Free' : `S$${price.toFixed(2)}`
  },
  latin_america: {
    currency: 'BRL',
    symbol: 'R$',
    essentialMonthly: 0,
    essentialYearly: 0,
    familyMonthly: 34.90,
    familyYearly: 349.90,
    businessMonthly: 69.90,
    businessYearly: 699.90,
    enterpriseMonthly: 119.90,
    enterpriseYearly: 1199.90,
    exchangeRate: 5.0,
    purchasingPowerParity: 0.35,
    taxRate: 0,
    localizedPriceString: (price) => price === 0 ? 'Free' : `R$${price.toFixed(2)}`
  },
  middle_east: {
    currency: 'AED',
    symbol: 'د.إ',
    essentialMonthly: 0,
    essentialYearly: 0,
    familyMonthly: 25.99,
    familyYearly: 259.99,
    businessMonthly: 54.99,
    businessYearly: 549.99,
    enterpriseMonthly: 89.99,
    enterpriseYearly: 899.99,
    exchangeRate: 3.67,
    purchasingPowerParity: 0.75,
    taxRate: 0.05, // VAT
    localizedPriceString: (price) => price === 0 ? 'Free' : `د.إ${price.toFixed(2)}`
  },
  africa: {
    currency: 'ZAR',
    symbol: 'R',
    essentialMonthly: 0,
    essentialYearly: 0,
    familyMonthly: 129.99,
    familyYearly: 1299.99,
    businessMonthly: 259.99,
    businessYearly: 2599.99,
    enterpriseMonthly: 429.99,
    enterpriseYearly: 4299.99,
    exchangeRate: 18.5,
    purchasingPowerParity: 0.30,
    taxRate: 0.15,
    localizedPriceString: (price) => price === 0 ? 'Free' : `R${price.toFixed(2)}`
  },
  oceania: {
    currency: 'AUD',
    symbol: 'A$',
    essentialMonthly: 0,
    essentialYearly: 0,
    familyMonthly: 10.99,
    familyYearly: 109.99,
    businessMonthly: 21.99,
    businessYearly: 219.99,
    enterpriseMonthly: 36.99,
    enterpriseYearly: 369.99,
    exchangeRate: 1.53,
    purchasingPowerParity: 1.0,
    taxRate: 0.10, // GST
    localizedPriceString: (price) => price === 0 ? 'Free' : `A$${price.toFixed(2)}`
  },
  east_asia: {
    currency: 'JPY',
    symbol: '¥',
    essentialMonthly: 0,
    essentialYearly: 0,
    familyMonthly: 980,
    familyYearly: 9800,
    businessMonthly: 1980,
    businessYearly: 19800,
    enterpriseMonthly: 3280,
    enterpriseYearly: 32800,
    exchangeRate: 150,
    purchasingPowerParity: 0.90,
    taxRate: 0.10,
    localizedPriceString: (price) => price === 0 ? 'Free' : `¥${price.toLocaleString('ja-JP')}`
  }
};

// Country to region mapping
export const COUNTRY_TO_REGION: Record<string, Region> = {
  // North America
  'US': 'north_america',
  'CA': 'north_america',
  
  // Western Europe
  'GB': 'western_europe',
  'DE': 'western_europe',
  'FR': 'western_europe',
  'IT': 'western_europe',
  'ES': 'western_europe',
  'NL': 'western_europe',
  'BE': 'western_europe',
  'AT': 'western_europe',
  'CH': 'western_europe',
  'IE': 'western_europe',
  'PT': 'western_europe',
  'DK': 'western_europe',
  'SE': 'western_europe',
  'NO': 'western_europe',
  'FI': 'western_europe',
  
  // Eastern Europe
  'PL': 'eastern_europe',
  'CZ': 'eastern_europe',
  'HU': 'eastern_europe',
  'RO': 'eastern_europe',
  'BG': 'eastern_europe',
  'UA': 'eastern_europe',
  'RU': 'eastern_europe',
  'GR': 'eastern_europe',
  
  // India
  'IN': 'india',
  
  // Southeast Asia
  'SG': 'southeast_asia',
  'MY': 'southeast_asia',
  'TH': 'southeast_asia',
  'VN': 'southeast_asia',
  'ID': 'southeast_asia',
  'PH': 'southeast_asia',
  
  // Latin America
  'BR': 'latin_america',
  'MX': 'latin_america',
  'AR': 'latin_america',
  'CL': 'latin_america',
  'CO': 'latin_america',
  'PE': 'latin_america',
  
  // Middle East
  'AE': 'middle_east',
  'SA': 'middle_east',
  'IL': 'middle_east',
  'TR': 'middle_east',
  'EG': 'middle_east',
  
  // Africa
  'ZA': 'africa',
  'NG': 'africa',
  'KE': 'africa',
  'MA': 'africa',
  'GH': 'africa',
  
  // Oceania
  'AU': 'oceania',
  'NZ': 'oceania',
  
  // East Asia
  'JP': 'east_asia',
  'CN': 'east_asia',
  'KR': 'east_asia',
  'TW': 'east_asia',
  'HK': 'east_asia'
};

// Subscription tiers
export type SubscriptionTier = 'essential' | 'family' | 'business' | 'enterprise';

export interface PricingTier {
  id: SubscriptionTier;
  name: string;
  description: string;
  monthlyPrice: number; // In USD for reference
  yearlyPrice: number;
  features: string[];
  limitations: string[];
  maxUsers: number;
  maxDevices: number;
  support: string;
  sla?: string;
  highlights?: string[];
}

// Tier definitions with features
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'essential',
    name: 'Essential',
    description: 'Basic protection for individuals',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Real-time malware protection',
      'Basic virus scanning',
      'Quarantine system',
      'Automatic signature updates',
      '1 device protection',
      'Community support'
    ],
    limitations: [
      'No AI-powered features',
      'No zero-day protection',
      'No VPN',
      'No parental controls',
      'No priority support'
    ],
    maxUsers: 1,
    maxDevices: 1,
    support: 'Community Forum'
  },
  {
    id: 'family',
    name: 'Family',
    description: 'Complete protection for the whole family',
    monthlyPrice: 6.99,
    yearlyPrice: 69.99,
    features: [
      'Everything in Essential',
      'AI-powered threat detection',
      'Zero-day exploit protection',
      '4 AI Security Agents',
      'Child Mode with parental controls',
      'Grandparent Mode (simplified UI)',
      'Guest Mode for visitors',
      'Screen time management',
      'Content filtering & SafeSearch',
      'Scam detection & Anti-phishing',
      'Up to 5 devices',
      'Priority email support',
      'Family dashboard'
    ],
    limitations: [
      'No VPN',
      'No identity theft monitoring',
      'Limited to 5 devices'
    ],
    maxUsers: 6,
    maxDevices: 5,
    support: 'Priority Email (24h response)',
    highlights: ['Most Popular', 'Best for Families']
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Advanced security for small teams',
    monthlyPrice: 14.99,
    yearlyPrice: 149.99,
    features: [
      'Everything in Family',
      'Up to 25 devices',
      'Team management console',
      'Role-based access control (RBAC)',
      'Centralized policy management',
      'VPN with 50+ locations',
      'Identity theft monitoring',
      'Dark web monitoring',
      'Password manager for team',
      'Secure cloud backup (100GB)',
      'System optimization tools',
      'Advanced firewall controls',
      'API access',
      'Priority phone & chat support',
      '99.5% SLA guarantee'
    ],
    limitations: [
      'No dedicated account manager',
      'No custom integrations'
    ],
    maxUsers: 25,
    maxDevices: 25,
    support: 'Priority Phone & Chat (4h response)',
    sla: '99.5% Uptime'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    monthlyPrice: 24.99,
    yearlyPrice: 249.99,
    features: [
      'Everything in Business',
      'Unlimited devices',
      'Dedicated account manager',
      'Custom security policies',
      'SIEM/SOAR integrations',
      'SSO/SAML authentication',
      'Active Directory sync',
      'Advanced threat intelligence',
      'Custom AI model training',
      'On-premise deployment option',
      'Data loss prevention (DLP)',
      'Endpoint detection & response (EDR)',
      'Forensic analysis tools',
      '24/7/365 premium support',
      '99.99% SLA guarantee',
      'Security audit reports',
      'Compliance reporting (SOC2, HIPAA, GDPR)'
    ],
    limitations: [],
    maxUsers: 9999,
    maxDevices: 9999,
    support: '24/7/365 Premium Support (1h response)',
    sla: '99.99% Uptime',
    highlights: ['Custom Pricing', 'Volume Discounts']
  }
];

// Volume discounts for Enterprise
export const VOLUME_DISCOUNTS: { minSeats: number; maxSeats: number; discount: number }[] = [
  { minSeats: 10, maxSeats: 49, discount: 0.10 },
  { minSeats: 50, maxSeats: 99, discount: 0.15 },
  { minSeats: 100, maxSeats: 249, discount: 0.20 },
  { minSeats: 250, maxSeats: 499, discount: 0.25 },
  { minSeats: 500, maxSeats: 999, discount: 0.30 },
  { minSeats: 1000, maxSeats: 999999, discount: 0.35 }
];

// Pricing engine class
export class PricingEngine {
  private region: Region;
  private pricing: RegionalPrice;
  
  constructor(countryCode?: string) {
    this.region = this.detectRegion(countryCode);
    this.pricing = REGIONAL_PRICING[this.region];
  }
  
  private detectRegion(countryCode?: string): Region {
    if (!countryCode) {
      return 'north_america';
    }
    return COUNTRY_TO_REGION[countryCode.toUpperCase()] || 'north_america';
  }
  
  public getRegion(): Region {
    return this.region;
  }
  
  public getPricing(): RegionalPrice {
    return this.pricing;
  }
  
  public getTierPricing(tier: SubscriptionTier): {
    monthly: string;
    yearly: string;
    monthlyUSD: number;
    yearlyUSD: number;
    savingsYearly: number;
  } {
    const p = this.pricing;
    
    switch (tier) {
      case 'essential':
        return {
          monthly: 'Free',
          yearly: 'Free',
          monthlyUSD: 0,
          yearlyUSD: 0,
          savingsYearly: 0
        };
      case 'family':
        return {
          monthly: p.localizedPriceString(p.familyMonthly),
          yearly: p.localizedPriceString(p.familyYearly),
          monthlyUSD: p.familyMonthly / p.exchangeRate,
          yearlyUSD: p.familyYearly / p.exchangeRate,
          savingsYearly: Math.round((1 - (p.familyYearly / 12) / p.familyMonthly) * 100)
        };
      case 'business':
        return {
          monthly: p.localizedPriceString(p.businessMonthly),
          yearly: p.localizedPriceString(p.businessYearly),
          monthlyUSD: p.businessMonthly / p.exchangeRate,
          yearlyUSD: p.businessYearly / p.exchangeRate,
          savingsYearly: Math.round((1 - (p.businessYearly / 12) / p.businessMonthly) * 100)
        };
      case 'enterprise':
        return {
          monthly: p.localizedPriceString(p.enterpriseMonthly),
          yearly: p.localizedPriceString(p.enterpriseYearly),
          monthlyUSD: p.enterpriseMonthly / p.exchangeRate,
          yearlyUSD: p.enterpriseYearly / p.exchangeRate,
          savingsYearly: Math.round((1 - (p.enterpriseYearly / 12) / p.enterpriseMonthly) * 100)
        };
    }
  }
  
  public getVolumeDiscount(seats: number): number {
    for (const tier of VOLUME_DISCOUNTS) {
      if (seats >= tier.minSeats && seats <= tier.maxSeats) {
        return tier.discount;
      }
    }
    return 0;
  }
  
  public getEnterprisePrice(seats: number, billingCycle: 'monthly' | 'yearly'): {
    basePrice: string;
    discount: number;
    finalPrice: string;
    savings: string;
  } {
    const basePrice = billingCycle === 'monthly' 
      ? this.pricing.enterpriseMonthly * seats
      : this.pricing.enterpriseYearly * seats;
    
    const discount = this.getVolumeDiscount(seats);
    const finalPrice = basePrice * (1 - discount);
    
    return {
      basePrice: this.pricing.localizedPriceString(basePrice),
      discount,
      finalPrice: this.pricing.localizedPriceString(finalPrice),
      savings: this.pricing.localizedPriceString(basePrice - finalPrice)
    };
  }
  
  public formatPrice(amount: number): string {
    return this.pricing.localizedPriceString(amount);
  }
  
  public getTaxRate(): number {
    return this.pricing.taxRate;
  }
  
  public getPriceWithTax(amount: number): string {
    const withTax = amount * (1 + this.pricing.taxRate);
    return this.pricing.localizedPriceString(withTax);
  }
  
  public convertToUSD(amount: number): number {
    return amount / this.pricing.exchangeRate;
  }
  
  public convertFromUSD(usdAmount: number): number {
    return usdAmount * this.pricing.exchangeRate;
  }
  
  public getCurrency(): Currency {
    return this.pricing.currency;
  }
  
  public getSymbol(): string {
    return this.pricing.symbol;
  }
  
  public calculateSavings(tier: SubscriptionTier, billingCycle: 'monthly' | 'yearly'): {
    comparedToMonthly: number;
    percentage: number;
  } {
    const p = this.pricing;
    
    if (tier === 'essential') {
      return { comparedToMonthly: 0, percentage: 0 };
    }
    
    let monthlyPrice: number, yearlyPrice: number;
    
    switch (tier) {
      case 'family':
        monthlyPrice = p.familyMonthly;
        yearlyPrice = p.familyYearly;
        break;
      case 'business':
        monthlyPrice = p.businessMonthly;
        yearlyPrice = p.businessYearly;
        break;
      case 'enterprise':
        monthlyPrice = p.enterpriseMonthly;
        yearlyPrice = p.enterpriseYearly;
        break;
      default:
        return { comparedToMonthly: 0, percentage: 0 };
    }
    
    if (billingCycle === 'monthly') {
      return { comparedToMonthly: 0, percentage: 0 };
    }
    
    const yearlySavings = (monthlyPrice * 12) - yearlyPrice;
    return {
      comparedToMonthly: yearlySavings,
      percentage: Math.round((yearlySavings / (monthlyPrice * 12)) * 100)
    };
  }
}

// Get region from timezone (fallback method)
export function getRegionFromTimezone(): Region {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    if (timezone.startsWith('America/')) {
      if (timezone.includes('New_York') || timezone.includes('Los_Angeles') || 
          timezone.includes('Chicago') || timezone.includes('Denver')) {
        return 'north_america';
      }
      return 'latin_america';
    }
    if (timezone.startsWith('Europe/')) {
      const western = ['London', 'Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam'];
      if (western.some(city => timezone.includes(city))) {
        return 'western_europe';
      }
      return 'eastern_europe';
    }
    if (timezone.startsWith('Asia/')) {
      if (timezone.includes('Kolkata') || timezone.includes('Mumbai')) {
        return 'india';
      }
      if (timezone.includes('Tokyo') || timezone.includes('Seoul') || timezone.includes('Shanghai')) {
        return 'east_asia';
      }
      return 'southeast_asia';
    }
    if (timezone.startsWith('Africa/')) {
      return 'africa';
    }
    if (timezone.startsWith('Australia/') || timezone.startsWith('Pacific/')) {
      return 'oceania';
    }
    
    return 'north_america';
  } catch {
    return 'north_america';
  }
}

// Singleton instance
let pricingEngineInstance: PricingEngine | null = null;

export function getPricingEngine(countryCode?: string): PricingEngine {
  if (!pricingEngineInstance) {
    pricingEngineInstance = new PricingEngine(countryCode);
  }
  return pricingEngineInstance;
}

export function resetPricingEngine(): void {
  pricingEngineInstance = null;
}
