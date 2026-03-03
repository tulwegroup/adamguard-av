// Zustand Store for Antivirus Dashboard
import { create } from 'zustand';
import { 
  mockThreats, 
  mockScans, 
  mockQuarantinedFiles, 
  mockSecurityEvents, 
  mockTeamMembers,
  mockDashboardStats,
  mockDefaultSettings,
  mockThreatTrendData,
  mockThreatTypeDistribution,
  mockAIAgents,
  type Threat,
  type ScanRecord,
  type QuarantinedFile,
  type SecurityEvent,
  type TeamMember,
  type DashboardStats,
  type AIAgent
} from './mockData';
import type { LicenseTier } from './license';

// Types
interface Exclusion {
  id: string;
  path: string;
  type: 'file' | 'folder' | 'extension';
  enabled: boolean;
}

interface LicenseState {
  tier: LicenseTier;
  organizationName: string;
  licenseId: string;
  startedAt: Date;
  expiresAt: Date | null;
  isPro: boolean;
  daysRemaining: number;
  maxDevices: number;
  billingCycle?: 'monthly' | 'yearly';
}

interface Settings {
  protection: {
    realTimeProtection: boolean;
    heuristicAnalysis: boolean;
    networkProtection: boolean;
    usbScanning: boolean;
    sensitivity: 'low' | 'medium' | 'high';
    aiProtection: boolean;
    zeroDayProtection: boolean;
    behavioralAnalysis: boolean;
  };
  scan: {
    scanArchives: boolean;
    scanEmails: boolean;
    maxFileSize: number;
    scanPriority: 'low' | 'normal' | 'high';
    fileTypes: string[];
    aiDeepScan: boolean;
  };
  notifications: {
    threatAlerts: boolean;
    scanComplete: boolean;
    updateAvailable: boolean;
    systemWarnings: boolean;
    emailNotifications: boolean;
    aiAlerts: boolean;
    zeroDayAlerts: boolean;
  };
  updates: {
    autoUpdate: boolean;
    updateFrequency: 'hourly' | 'daily' | 'weekly';
    includeBeta: boolean;
    aiModelUpdates: boolean;
  };
  exclusions: Exclusion[];
}

interface Notification {
  id: string;
  type: 'threat' | 'scan' | 'update' | 'warning' | 'info' | 'ai' | 'zero_day';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface AntivirusState {
  // Dashboard
  stats: DashboardStats;
  protectionEnabled: boolean;
  
  // License
  license: LicenseState;
  
  // Threats
  threats: Threat[];
  
  // Scans
  scans: ScanRecord[];
  activeScan: ScanRecord | null;
  scanProgress: number;
  isScanning: boolean;
  
  // Quarantine
  quarantinedFiles: QuarantinedFile[];
  
  // Events
  events: SecurityEvent[];
  
  // Team
  teamMembers: TeamMember[];
  
  // AI Agents
  aiAgents: AIAgent[];
  aiProtectionEnabled: boolean;
  
  // Settings
  settings: Settings;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Analytics
  trendData: typeof mockThreatTrendData;
  typeDistribution: typeof mockThreatTypeDistribution;
  
  // Current tab
  activeTab: string;
  
  // Actions
  setActiveTab: (tab: string) => void;
  toggleProtection: () => void;
  toggleAIProtection: () => void;
  
  // Scan actions
  startScan: (type: 'quick' | 'full' | 'custom' | 'ai_deep', path?: string) => void;
  cancelScan: () => void;
  updateScanProgress: (progress: number, filesScanned: number, threatsFound: number) => void;
  completeScan: () => void;
  
  // Quarantine actions
  restoreFromQuarantine: (id: string) => void;
  deleteFromQuarantine: (id: string) => void;
  
  // Settings actions
  updateSettings: (category: keyof Settings, key: string, value: unknown) => void;
  addExclusion: (exclusion: Exclusion) => void;
  removeExclusion: (id: string) => void;
  toggleExclusion: (id: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  
  // Threat actions
  quarantineThreat: (id: string) => void;
  removeThreat: (id: string) => void;
  
  // AI Agent actions
  updateAIAgentStatus: (id: string, status: AIAgent['status'], task: string, progress: number) => void;
  runAIAnalysis: () => void;
  
  // License actions
  setLicense: (license: LicenseState) => void;
  upgradeToPro: () => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Calculate trial days remaining - use static value to avoid hydration issues
const getInitialDaysRemaining = () => {
  // Static calculation for initial render
  return 14; // Default to full trial
};

export const useAntivirusStore = create<AntivirusState>((set, get) => ({
  // Initial state
  stats: mockDashboardStats,
  protectionEnabled: mockDashboardStats.protectionEnabled,
  
  // License - start with trial
  license: {
    tier: 'trial',
    organizationName: 'AdamGuard Demo',
    licenseId: 'AG-DEMO-TRIAL',
    startedAt: new Date('2026-02-01'),
    expiresAt: new Date('2026-02-15'),
    isPro: false,
    daysRemaining: 14, // Static initial value
    maxDevices: 1
  },
  
  threats: mockThreats,
  
  scans: mockScans,
  activeScan: null,
  scanProgress: 0,
  isScanning: false,
  
  quarantinedFiles: mockQuarantinedFiles,
  
  events: mockSecurityEvents,
  
  teamMembers: mockTeamMembers,
  
  aiAgents: mockAIAgents,
  aiProtectionEnabled: true,
  
  settings: mockDefaultSettings,
  
  notifications: [
    {
      id: '1',
      type: 'zero_day',
      title: 'Zero-Day Attack Blocked',
      message: 'AI detected novel ransomware variant - ZeroDay.BlackCat2026',
      timestamp: new Date('2026-02-15T12:00:00.000Z'),
      read: false
    },
    {
      id: '2',
      type: 'ai',
      title: 'AI Analysis Complete',
      message: 'Behavioral analysis identified 3 new threat patterns',
      timestamp: new Date('2026-02-15T11:30:00.000Z'),
      read: false
    },
    {
      id: '3',
      type: 'threat',
      title: 'Threat Detected',
      message: 'Trojan.Emotet found in Downloads folder',
      timestamp: new Date('2026-02-15T11:00:00.000Z'),
      read: false
    },
    {
      id: '4',
      type: 'update',
      title: 'Signatures Updated',
      message: 'Database updated to version 2026.02.15.001',
      timestamp: new Date('2026-02-15T10:00:00.000Z'),
      read: true
    },
    {
      id: '5',
      type: 'scan',
      title: 'AI Deep Scan Complete',
      message: 'Deep analysis finished - 12 threats found including 2 zero-days',
      timestamp: new Date('2026-02-15T09:00:00.000Z'),
      read: true
    }
  ],
  unreadCount: 3,
  
  trendData: mockThreatTrendData,
  typeDistribution: mockThreatTypeDistribution,
  
  activeTab: 'dashboard',
  
  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  toggleProtection: () => set((state) => {
    const newEnabled = !state.protectionEnabled;
    return {
      protectionEnabled: newEnabled,
      stats: { ...state.stats, protectionEnabled: newEnabled }
    };
  }),
  
  toggleAIProtection: () => set((state) => ({
    aiProtectionEnabled: !state.aiProtectionEnabled
  })),
  
  startScan: (type, path) => {
    const newScan: ScanRecord = {
      id: generateId(),
      type,
      status: 'running',
      filesScanned: 0,
      threatsFound: 0,
      filesSkipped: 0,
      startedAt: new Date(),
      completedAt: null,
      path: path || undefined,
      aiAnalysis: type === 'ai_deep'
    };
    
    set({
      activeScan: newScan,
      scanProgress: 0,
      isScanning: true
    });
    
    // Simulate scan progress
    let progress = 0;
    const interval = setInterval(() => {
      const state = get();
      if (!state.isScanning) {
        clearInterval(interval);
        return;
      }
      
      progress += Math.random() * 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        get().completeScan();
      }
      
      const filesScanned = Math.floor(progress * (type === 'full' || type === 'ai_deep' ? 8924 : 24.5));
      const threatsFound = Math.floor(progress / 30);
      
      set({
        scanProgress: progress,
        activeScan: state.activeScan ? {
          ...state.activeScan,
          filesScanned,
          threatsFound
        } : null
      });
    }, 200);
  },
  
  cancelScan: () => set((state) => ({
    isScanning: false,
    scanProgress: 0,
    activeScan: state.activeScan ? {
      ...state.activeScan,
      status: 'cancelled',
      completedAt: new Date()
    } : null
  })),
  
  updateScanProgress: (progress, filesScanned, threatsFound) => set((state) => ({
    scanProgress: progress,
    activeScan: state.activeScan ? {
      ...state.activeScan,
      filesScanned,
      threatsFound
    } : null
  })),
  
  completeScan: () => set((state) => {
    const completedScan = state.activeScan ? {
      ...state.activeScan,
      status: 'completed' as const,
      completedAt: new Date(),
      duration: Math.floor((Date.now() - (state.activeScan.startedAt?.getTime() || Date.now())) / 1000)
    } : null;
    
    return {
      isScanning: false,
      scanProgress: 100,
      activeScan: completedScan,
      scans: completedScan ? [completedScan, ...state.scans] : state.scans,
      stats: {
        ...state.stats,
        lastScanTime: new Date()
      }
    };
  }),
  
  restoreFromQuarantine: (id) => set((state) => ({
    quarantinedFiles: state.quarantinedFiles.filter(f => f.id !== id)
  })),
  
  deleteFromQuarantine: (id) => set((state) => ({
    quarantinedFiles: state.quarantinedFiles.filter(f => f.id !== id)
  })),
  
  updateSettings: (category, key, value) => set((state) => ({
    settings: {
      ...state.settings,
      [category]: {
        ...state.settings[category] as Record<string, unknown>,
        [key]: value
      }
    }
  })),
  
  addExclusion: (exclusion) => set((state) => ({
    settings: {
      ...state.settings,
      exclusions: [...state.settings.exclusions, exclusion]
    }
  })),
  
  removeExclusion: (id) => set((state) => ({
    settings: {
      ...state.settings,
      exclusions: state.settings.exclusions.filter(e => e.id !== id)
    }
  })),
  
  toggleExclusion: (id) => set((state) => ({
    settings: {
      ...state.settings,
      exclusions: state.settings.exclusions.map(e => 
        e.id === id ? { ...e, enabled: !e.enabled } : e
      )
    }
  })),
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      { ...notification, id: generateId(), timestamp: new Date(), read: false },
      ...state.notifications
    ].slice(0, 50),
    unreadCount: state.unreadCount + 1
  })),
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),
  
  clearNotifications: () => set({
    notifications: [],
    unreadCount: 0
  }),
  
  quarantineThreat: (id) => set((state) => ({
    threats: state.threats.map(t => 
      t.id === id ? { ...t, status: 'quarantined', quarantined: true } : t
    )
  })),
  
  removeThreat: (id) => set((state) => ({
    threats: state.threats.map(t => 
      t.id === id ? { ...t, status: 'removed' } : t
    )
  })),
  
  updateAIAgentStatus: (id, status, task, progress) => set((state) => ({
    aiAgents: state.aiAgents.map(agent => 
      agent.id === id ? { ...agent, status, task, progress, lastActivity: new Date() } : agent
    )
  })),
  
  runAIAnalysis: () => {
    // Simulate AI analysis running
    set((state) => ({
      aiAgents: state.aiAgents.map(agent => ({
        ...agent,
        status: 'processing' as const,
        progress: 0
      }))
    }));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        set((state) => ({
          aiAgents: state.aiAgents.map(agent => ({
            ...agent,
            status: 'active' as const,
            progress: 100,
            lastActivity: new Date()
          }))
        }));
      } else {
        set((state) => ({
          aiAgents: state.aiAgents.map(agent => ({
            ...agent,
            progress
          }))
        }));
      }
    }, 500);
  },
  
  setLicense: (license) => set({ license }),
  
  upgradeToPro: () => set({
    license: {
      tier: 'family',
      organizationName: get().license.organizationName,
      licenseId: 'AG-FAMILY-' + generateId(),
      startedAt: new Date(),
      expiresAt: null,
      isPro: true,
      daysRemaining: Infinity,
      maxDevices: 5,
      billingCycle: 'yearly'
    }
  })
}));
