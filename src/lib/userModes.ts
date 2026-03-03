// User Modes System for AdamGuard Pro
// Child Mode, Grandparent Mode, Parent Mode, Guest Mode

import type { LanguageCode } from './localization';

export type UserMode = 'normal' | 'child' | 'grandparent' | 'parent' | 'guest';

export interface UserModeConfig {
  mode: UserMode;
  name: string;
  description: string;
  icon: string;
  features: string[];
  restrictions: string[];
  uiSettings: UISettings;
  securitySettings: SecuritySettings;
  timeLimit?: number; // For guest mode (minutes)
  parentId?: string; // For child mode
}

export interface UISettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrast: 'normal' | 'high' | 'extra-high';
  iconSize: 'small' | 'medium' | 'large';
  simplifiedNavigation: boolean;
  showAdvancedOptions: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast' | 'none';
  language: LanguageCode;
  colorTheme: 'default' | 'high-contrast' | 'colorblind';
}

export interface SecuritySettings {
  allowSettings: boolean;
  allowInstall: boolean;
  allowUninstall: boolean;
  allowFileAccess: boolean;
  allowNetworkAccess: boolean;
  allowCamera: boolean;
  allowMicrophone: boolean;
  allowLocation: boolean;
  allowNotifications: boolean;
  allowPayment: boolean;
  allowSocialMedia: boolean;
  allowGames: boolean;
  allowWebBrowsing: boolean;
  contentFilterLevel: 'none' | 'light' | 'moderate' | 'strict';
  scamProtection: boolean;
  phishingProtection: boolean;
  callScreening: boolean;
}

// Default configurations for each mode
export const DEFAULT_MODE_CONFIGS: Record<UserMode, UserModeConfig> = {
  normal: {
    mode: 'normal',
    name: 'Normal Mode',
    description: 'Standard interface with all features available',
    icon: 'User',
    features: ['All features'],
    restrictions: [],
    uiSettings: {
      fontSize: 'medium',
      contrast: 'normal',
      iconSize: 'medium',
      simplifiedNavigation: false,
      showAdvancedOptions: true,
      animationSpeed: 'normal',
      language: 'en',
      colorTheme: 'default'
    },
    securitySettings: {
      allowSettings: true,
      allowInstall: true,
      allowUninstall: true,
      allowFileAccess: true,
      allowNetworkAccess: true,
      allowCamera: true,
      allowMicrophone: true,
      allowLocation: true,
      allowNotifications: true,
      allowPayment: true,
      allowSocialMedia: true,
      allowGames: true,
      allowWebBrowsing: true,
      contentFilterLevel: 'none',
      scamProtection: true,
      phishingProtection: true,
      callScreening: true
    }
  },
  child: {
    mode: 'child',
    name: 'Child Mode',
    description: 'Safe environment for children with parental controls',
    icon: 'Baby',
    features: [
      'Content filtering',
      'Screen time limits',
      'App restrictions',
      'Safe search',
      'Location tracking',
      'Activity reports',
      'Geo-fencing'
    ],
    restrictions: [
      'No settings access',
      'No app installation',
      'No payment access',
      'No social media',
      'Content restrictions'
    ],
    uiSettings: {
      fontSize: 'large',
      contrast: 'normal',
      iconSize: 'large',
      simplifiedNavigation: true,
      showAdvancedOptions: false,
      animationSpeed: 'normal',
      language: 'en',
      colorTheme: 'default'
    },
    securitySettings: {
      allowSettings: false,
      allowInstall: false,
      allowUninstall: false,
      allowFileAccess: false,
      allowNetworkAccess: true,
      allowCamera: false,
      allowMicrophone: false,
      allowLocation: true,
      allowNotifications: true,
      allowPayment: false,
      allowSocialMedia: false,
      allowGames: true,
      allowWebBrowsing: true,
      contentFilterLevel: 'strict',
      scamProtection: true,
      phishingProtection: true,
      callScreening: true
    }
  },
  grandparent: {
    mode: 'grandparent',
    name: 'Grandparent Mode',
    description: 'Simplified interface with enhanced scam protection',
    icon: 'Heart',
    features: [
      'Large text and icons',
      'One-click security scan',
      'Scam call detection',
      'Suspicious email alerts',
      'Fraud explanations',
      'Family sharing',
      'Remote assistance',
      'Emergency contacts'
    ],
    restrictions: [
      'Simplified settings only',
      'No advanced configuration'
    ],
    uiSettings: {
      fontSize: 'extra-large',
      contrast: 'high',
      iconSize: 'large',
      simplifiedNavigation: true,
      showAdvancedOptions: false,
      animationSpeed: 'slow',
      language: 'en',
      colorTheme: 'high-contrast'
    },
    securitySettings: {
      allowSettings: true,
      allowInstall: false,
      allowUninstall: false,
      allowFileAccess: true,
      allowNetworkAccess: true,
      allowCamera: true,
      allowMicrophone: true,
      allowLocation: true,
      allowNotifications: true,
      allowPayment: true,
      allowSocialMedia: true,
      allowGames: false,
      allowWebBrowsing: true,
      contentFilterLevel: 'moderate',
      scamProtection: true,
      phishingProtection: true,
      callScreening: true
    }
  },
  parent: {
    mode: 'parent',
    name: 'Parent Mode',
    description: 'Full access with family management controls',
    icon: 'Users',
    features: [
      'Full system access',
      'Family dashboard',
      'Child activity monitoring',
      'Screen time management',
      'Purchase approvals',
      'Location tracking',
      'Emergency alerts',
      'Financial protection'
    ],
    restrictions: [],
    uiSettings: {
      fontSize: 'medium',
      contrast: 'normal',
      iconSize: 'medium',
      simplifiedNavigation: false,
      showAdvancedOptions: true,
      animationSpeed: 'normal',
      language: 'en',
      colorTheme: 'default'
    },
    securitySettings: {
      allowSettings: true,
      allowInstall: true,
      allowUninstall: true,
      allowFileAccess: true,
      allowNetworkAccess: true,
      allowCamera: true,
      allowMicrophone: true,
      allowLocation: true,
      allowNotifications: true,
      allowPayment: true,
      allowSocialMedia: true,
      allowGames: true,
      allowWebBrowsing: true,
      contentFilterLevel: 'none',
      scamProtection: true,
      phishingProtection: true,
      callScreening: true
    }
  },
  guest: {
    mode: 'guest',
    name: 'Guest Mode',
    description: 'Temporary isolated access with automatic cleanup',
    icon: 'UserPlus',
    features: [
      'Browsing only',
      'Isolated environment',
      'No file access',
      'Automatic cleanup',
      'Time-limited session'
    ],
    restrictions: [
      'No settings access',
      'No file access',
      'No installation',
      'No payment',
      'Time limited'
    ],
    uiSettings: {
      fontSize: 'medium',
      contrast: 'normal',
      iconSize: 'medium',
      simplifiedNavigation: true,
      showAdvancedOptions: false,
      animationSpeed: 'normal',
      language: 'en',
      colorTheme: 'default'
    },
    securitySettings: {
      allowSettings: false,
      allowInstall: false,
      allowUninstall: false,
      allowFileAccess: false,
      allowNetworkAccess: true,
      allowCamera: false,
      allowMicrophone: false,
      allowLocation: false,
      allowNotifications: false,
      allowPayment: false,
      allowSocialMedia: false,
      allowGames: false,
      allowWebBrowsing: true,
      contentFilterLevel: 'moderate',
      scamProtection: true,
      phishingProtection: true,
      callScreening: true
    },
    timeLimit: 60 // 1 hour default
  }
};

// Screen time configuration
export interface ScreenTimeConfig {
  enabled: boolean;
  dailyLimitMinutes: number;
  bedtimeStart: string; // HH:MM format
  bedtimeEnd: string;
  allowedDays: number[]; // 0-6, Sunday to Saturday
  appLimits: AppTimeLimit[];
  rewardMinutes: number; // Extra time earned through educational activities
}

export interface AppTimeLimit {
  appId: string;
  appName: string;
  dailyLimitMinutes: number;
  category: 'games' | 'social' | 'education' | 'entertainment' | 'other';
}

// Content filter configuration
export interface ContentFilterConfig {
  enabled: boolean;
  level: 'light' | 'moderate' | 'strict';
  blockedCategories: ContentCategory[];
  blockedWebsites: string[];
  allowedWebsites: string[];
  safeSearch: boolean;
  youtubeRestrictedMode: boolean;
  blockAds: boolean;
  blockTrackers: boolean;
}

export type ContentCategory = 
  | 'adult'
  | 'violence'
  | 'gambling'
  | 'drugs'
  | 'weapons'
  | 'hate'
  | 'social_media'
  | 'streaming'
  | 'gaming'
  | 'shopping';

// Geo-fencing configuration
export interface GeoFence {
  id: string;
  name: string;
  type: 'home' | 'school' | 'safe_zone' | 'restricted';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number; // meters
  notifications: {
    onEnter: boolean;
    onExit: boolean;
    notifyParents: boolean;
  };
  allowedTimes?: {
    start: string; // HH:MM
    end: string;
  };
}

// Scam detection configuration
export interface ScamDetectionConfig {
  enabled: boolean;
  callScreening: boolean;
  smsFiltering: boolean;
  emailScanning: boolean;
  knownScamNumbers: string[];
  suspiciousPatterns: string[];
  autoBlock: boolean;
  logCalls: boolean;
  familyAlerts: boolean;
}

// Activity report
export interface ActivityReport {
  id: string;
  userId: string;
  date: Date;
  screenTimeMinutes: number;
  appsUsed: AppUsage[];
  websitesVisited: WebsiteVisit[];
  blockedAttempts: BlockedAttempt[];
  locationHistory: LocationPoint[];
  alerts: Alert[];
}

export interface AppUsage {
  appId: string;
  appName: string;
  category: string;
  durationMinutes: number;
  openedAt: Date[];
}

export interface WebsiteVisit {
  url: string;
  domain: string;
  category: string;
  durationSeconds: number;
  visitedAt: Date;
  blocked: boolean;
  blockedReason?: string;
}

export interface BlockedAttempt {
  type: 'app' | 'website' | 'call' | 'sms' | 'payment';
  identifier: string;
  name: string;
  reason: string;
  timestamp: Date;
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  geoFenceId?: string;
}

export interface Alert {
  id: string;
  type: 'geo_fence_enter' | 'geo_fence_exit' | 'screen_time_exceeded' | 'blocked_content' | 'suspicious_call' | 'sos';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

// User mode manager class
export class UserModeManager {
  private currentMode: UserMode = 'normal';
  private modeConfig: UserModeConfig = DEFAULT_MODE_CONFIGS.normal;
  private screenTimeConfig: ScreenTimeConfig | null = null;
  private contentFilterConfig: ContentFilterConfig | null = null;
  private geoFences: GeoFence[] = [];
  private scamDetectionConfig: ScamDetectionConfig | null = null;
  
  constructor(initialMode: UserMode = 'normal') {
    this.setMode(initialMode);
  }
  
  public getMode(): UserMode {
    return this.currentMode;
  }
  
  public getConfig(): UserModeConfig {
    return this.modeConfig;
  }
  
  public setMode(mode: UserMode): void {
    this.currentMode = mode;
    this.modeConfig = { ...DEFAULT_MODE_CONFIGS[mode] };
    
    // Apply mode-specific defaults
    if (mode === 'child') {
      this.screenTimeConfig = {
        enabled: true,
        dailyLimitMinutes: 120,
        bedtimeStart: '21:00',
        bedtimeEnd: '07:00',
        allowedDays: [1, 2, 3, 4, 5, 6, 0],
        appLimits: [],
        rewardMinutes: 0
      };
      
      this.contentFilterConfig = {
        enabled: true,
        level: 'strict',
        blockedCategories: ['adult', 'violence', 'gambling', 'drugs', 'weapons', 'hate'],
        blockedWebsites: [],
        allowedWebsites: [],
        safeSearch: true,
        youtubeRestrictedMode: true,
        blockAds: true,
        blockTrackers: true
      };
      
      this.scamDetectionConfig = {
        enabled: true,
        callScreening: true,
        smsFiltering: true,
        emailScanning: true,
        knownScamNumbers: [],
        suspiciousPatterns: [],
        autoBlock: true,
        logCalls: true,
        familyAlerts: true
      };
    }
    
    if (mode === 'grandparent') {
      this.scamDetectionConfig = {
        enabled: true,
        callScreening: true,
        smsFiltering: true,
        emailScanning: true,
        knownScamNumbers: [],
        suspiciousPatterns: [],
        autoBlock: true,
        logCalls: true,
        familyAlerts: true
      };
    }
  }
  
  public getUISettings(): UISettings {
    return this.modeConfig.uiSettings;
  }
  
  public getSecuritySettings(): SecuritySettings {
    return this.modeConfig.securitySettings;
  }
  
  public hasPermission(permission: keyof SecuritySettings): boolean {
    return this.modeConfig.securitySettings[permission] as boolean;
  }
  
  public getScreenTimeConfig(): ScreenTimeConfig | null {
    return this.screenTimeConfig;
  }
  
  public setScreenTimeConfig(config: Partial<ScreenTimeConfig>): void {
    if (this.screenTimeConfig) {
      this.screenTimeConfig = { ...this.screenTimeConfig, ...config };
    }
  }
  
  public getContentFilterConfig(): ContentFilterConfig | null {
    return this.contentFilterConfig;
  }
  
  public setContentFilterConfig(config: Partial<ContentFilterConfig>): void {
    if (this.contentFilterConfig) {
      this.contentFilterConfig = { ...this.contentFilterConfig, ...config };
    }
  }
  
  public getGeoFences(): GeoFence[] {
    return this.geoFences;
  }
  
  public addGeoFence(fence: GeoFence): void {
    this.geoFences.push(fence);
  }
  
  public removeGeoFence(id: string): void {
    this.geoFences = this.geoFences.filter(f => f.id !== id);
  }
  
  public getScamDetectionConfig(): ScamDetectionConfig | null {
    return this.scamDetectionConfig;
  }
  
  public isFeatureAvailable(feature: string): boolean {
    return this.modeConfig.features.includes(feature);
  }
  
  public isRestricted(restriction: string): boolean {
    return this.modeConfig.restrictions.includes(restriction);
  }
}

// Singleton instance
let userModeInstance: UserModeManager | null = null;

export function getUserModeManager(): UserModeManager {
  if (!userModeInstance) {
    userModeInstance = new UserModeManager();
  }
  return userModeInstance;
}

export function resetUserModeManager(): void {
  userModeInstance = null;
}
