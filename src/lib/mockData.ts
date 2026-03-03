// Mock Data for Antivirus Dashboard

export interface Threat {
  id: string;
  name: string;
  type: 'Virus' | 'Trojan' | 'Worm' | 'Ransomware' | 'PUP' | 'Adware' | 'Spyware' | 'ZeroDay';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  path: string;
  hash: string;
  size: number;
  status: 'active' | 'quarantined' | 'removed' | 'false_positive';
  detectedAt: Date;
  quarantined: boolean;
  aiDetected?: boolean;
  zeroDay?: boolean;
}

export interface ScanRecord {
  id: string;
  type: 'quick' | 'full' | 'custom' | 'ai_deep';
  status: 'pending' | 'running' | 'completed' | 'cancelled' | 'error';
  filesScanned: number;
  threatsFound: number;
  filesSkipped: number;
  startedAt: Date | null;
  completedAt: Date | null;
  path?: string;
  duration?: number;
  aiAnalysis?: boolean;
}

export interface QuarantinedFile {
  id: string;
  originalPath: string;
  threatName: string;
  threatType: string;
  quarantinedAt: Date;
  size: number;
  hash: string;
  restored: boolean;
  aiConfidence?: number;
}

export interface SecurityEvent {
  id: string;
  eventType: 'threat_detected' | 'scan_completed' | 'file_blocked' | 'quarantine_action' | 'settings_changed' | 'update_available' | 'real_time_block' | 'ai_detection' | 'zero_day_blocked';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  timestamp: Date;
  processName?: string;
  filePath?: string;
  aiFlagged?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  avatar: string;
  lastActive: Date;
  status: 'online' | 'offline' | 'away';
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing';
  task: string;
  progress: number;
  lastActivity: Date;
  threatCount: number;
  accuracy: number;
}

export interface DashboardStats {
  threatsBlocked: number;
  filesProtected: number;
  activeScans: number;
  lastScanTime: Date | null;
  protectionEnabled: boolean;
  signatureVersion: string;
  lastUpdate: Date;
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  aiStats: {
    threatsAnalyzed: number;
    zeroDayBlocked: number;
    accuracy: number;
    activeAgents: number;
  };
}

// Fixed dates - February 15, 2026
const now = new Date('2026-02-15T12:00:00.000Z');
const hourAgo = new Date('2026-02-15T11:00:00.000Z');
const twoHoursAgo = new Date('2026-02-15T10:00:00.000Z');
const threeHoursAgo = new Date('2026-02-15T09:00:00.000Z');
const fourHoursAgo = new Date('2026-02-15T08:00:00.000Z');
const fiveHoursAgo = new Date('2026-02-15T07:00:00.000Z');
const sixHoursAgo = new Date('2026-02-15T06:00:00.000Z');
const sevenHoursAgo = new Date('2026-02-15T05:00:00.000Z');
const eightHoursAgo = new Date('2026-02-15T04:00:00.000Z');
const oneDayAgo = new Date('2026-02-14T12:00:00.000Z');
const twoDaysAgo = new Date('2026-02-13T12:00:00.000Z');
const threeDaysAgo = new Date('2026-02-12T12:00:00.000Z');
const fiveDaysAgo = new Date('2026-02-10T12:00:00.000Z');
const sevenDaysAgo = new Date('2026-02-08T12:00:00.000Z');
const eightDaysAgo = new Date('2026-02-07T12:00:00.000Z');
const tenDaysAgo = new Date('2026-02-05T12:00:00.000Z');

// Generate mock threats with fixed dates
export const mockThreats: Threat[] = [
  {
    id: '1',
    name: 'Trojan.Emotet',
    type: 'Trojan',
    severity: 'Critical',
    path: 'C:\\Users\\Admin\\Downloads\\invoice.doc.exe',
    hash: 'a1b2c3d4e5f6789012345678901234567890abcd1234567890abcdef12345678',
    size: 245760,
    status: 'quarantined',
    detectedAt: hourAgo,
    quarantined: true,
    aiDetected: true
  },
  {
    id: '2',
    name: 'ZeroDay.BlackCat2026',
    type: 'ZeroDay',
    severity: 'Critical',
    path: 'C:\\Windows\\Temp\\update.exe',
    hash: 'b2c3d4e5f6789012345678901234567890abcd1234567890abcdef1234567890',
    size: 512000,
    status: 'quarantined',
    detectedAt: twoHoursAgo,
    quarantined: true,
    aiDetected: true,
    zeroDay: true
  },
  {
    id: '3',
    name: 'PUP.Bundler',
    type: 'PUP',
    severity: 'Low',
    path: 'C:\\Program Files\\FreeApp\\helper.dll',
    hash: 'c3d4e5f6789012345678901234567890abcd1234567890abcdef123456789012',
    size: 89000,
    status: 'quarantined',
    detectedAt: threeHoursAgo,
    quarantined: true,
    aiDetected: false
  },
  {
    id: '4',
    name: 'Trojan.QakBot',
    type: 'Trojan',
    severity: 'High',
    path: 'C:\\Users\\Admin\\AppData\\Local\\Temp\\service.exe',
    hash: 'd4e5f6789012345678901234567890abcd1234567890abcdef12345678901234',
    size: 320000,
    status: 'active',
    detectedAt: now,
    quarantined: false,
    aiDetected: true
  },
  {
    id: '5',
    name: 'Adware.Superfish',
    type: 'Adware',
    severity: 'Medium',
    path: 'C:\\Program Files (x86)\\BrowserAddon\\addon.dll',
    hash: 'e5f6789012345678901234567890abcd1234567890abcdef1234567890123456',
    size: 150000,
    status: 'removed',
    detectedAt: fiveDaysAgo,
    quarantined: false,
    aiDetected: false
  },
  {
    id: '6',
    name: 'Worm.WannaCry',
    type: 'Worm',
    severity: 'Critical',
    path: 'C:\\Windows\\System32\\tasksche.exe',
    hash: 'f6789012345678901234567890abcd1234567890abcdef123456789012345678',
    size: 3500000,
    status: 'quarantined',
    detectedAt: sevenDaysAgo,
    quarantined: true,
    aiDetected: true
  },
  {
    id: '7',
    name: 'ZeroDay.StealerNova',
    type: 'ZeroDay',
    severity: 'Critical',
    path: 'C:\\Users\\Admin\\Documents\\report.xls.exe',
    hash: '6789012345678901234567890abcd1234567890abcdef1234567890123456789',
    size: 180000,
    status: 'quarantined',
    detectedAt: fourHoursAgo,
    quarantined: true,
    aiDetected: true,
    zeroDay: true
  },
  {
    id: '8',
    name: 'Win32.Neshta',
    type: 'Virus',
    severity: 'High',
    path: 'C:\\Users\\Public\\Desktop\\setup.exe',
    hash: '789012345678901234567890abcd1234567890abcdef12345678901234567890',
    size: 42000,
    status: 'quarantined',
    detectedAt: fourHoursAgo,
    quarantined: true,
    aiDetected: false
  },
  {
    id: '9',
    name: 'Ransom.Ryuk',
    type: 'Ransomware',
    severity: 'Critical',
    path: 'C:\\Windows\\Temp\\rundll32.exe',
    hash: '89012345678901234567890abcd1234567890abcdef123456789012345678901',
    size: 680000,
    status: 'quarantined',
    detectedAt: sixHoursAgo,
    quarantined: true,
    aiDetected: true
  },
  {
    id: '10',
    name: 'PUP.Optional.InstallCore',
    type: 'PUP',
    severity: 'Low',
    path: 'C:\\Users\\Admin\\Downloads\\installer.exe',
    hash: '9012345678901234567890abcd1234567890abcdef1234567890123456789012',
    size: 2100000,
    status: 'active',
    detectedAt: now,
    quarantined: false,
    aiDetected: false
  },
  {
    id: '11',
    name: 'Trojan.Zeus',
    type: 'Trojan',
    severity: 'Critical',
    path: 'C:\\Users\\Admin\\AppData\\Roaming\\Microsoft\\svchost.exe',
    hash: '012345678901234567890abcd1234567890abcdef12345678901234567890123',
    size: 290000,
    status: 'quarantined',
    detectedAt: eightDaysAgo,
    quarantined: true,
    aiDetected: true
  },
  {
    id: '12',
    name: 'Adware.PopUp',
    type: 'Adware',
    severity: 'Medium',
    path: 'C:\\Program Files\\AdBlockerPro\\popup.dll',
    hash: '12345678901234567890abcd1234567890abcdef123456789012345678901234',
    size: 75000,
    status: 'false_positive',
    detectedAt: tenDaysAgo,
    quarantined: false,
    aiDetected: false
  }
];

// Generate mock scans
export const mockScans: ScanRecord[] = [
  {
    id: '1',
    type: 'quick',
    status: 'completed',
    filesScanned: 24580,
    threatsFound: 3,
    filesSkipped: 120,
    startedAt: hourAgo,
    completedAt: now,
    duration: 180,
    aiAnalysis: true
  },
  {
    id: '2',
    type: 'ai_deep',
    status: 'completed',
    filesScanned: 892450,
    threatsFound: 12,
    filesSkipped: 2340,
    startedAt: threeDaysAgo,
    completedAt: threeDaysAgo,
    duration: 5400,
    aiAnalysis: true
  },
  {
    id: '3',
    type: 'custom',
    status: 'completed',
    filesScanned: 5600,
    threatsFound: 1,
    filesSkipped: 45,
    startedAt: fiveDaysAgo,
    completedAt: fiveDaysAgo,
    path: 'C:\\Users\\Admin\\Downloads',
    duration: 120,
    aiAnalysis: true
  },
  {
    id: '4',
    type: 'full',
    status: 'completed',
    filesScanned: 892450,
    threatsFound: 7,
    filesSkipped: 2340,
    startedAt: sevenDaysAgo,
    completedAt: sevenDaysAgo,
    duration: 3600,
    aiAnalysis: true
  },
  {
    id: '5',
    type: 'quick',
    status: 'cancelled',
    filesScanned: 45000,
    threatsFound: 2,
    filesSkipped: 200,
    startedAt: tenDaysAgo,
    completedAt: null,
    duration: 600
  }
];

// Generate mock quarantined files
export const mockQuarantinedFiles: QuarantinedFile[] = [
  {
    id: '1',
    originalPath: 'C:\\Users\\Admin\\Downloads\\invoice.doc.exe',
    threatName: 'Trojan.Emotet',
    threatType: 'Trojan',
    quarantinedAt: hourAgo,
    size: 245760,
    hash: 'a1b2c3d4e5f6789012345678901234567890abcd1234567890abcdef12345678',
    restored: false,
    aiConfidence: 99.8
  },
  {
    id: '2',
    originalPath: 'C:\\Windows\\Temp\\update.exe',
    threatName: 'ZeroDay.BlackCat2026',
    threatType: 'ZeroDay',
    quarantinedAt: twoHoursAgo,
    size: 512000,
    hash: 'b2c3d4e5f6789012345678901234567890abcd1234567890abcdef1234567890',
    restored: false,
    aiConfidence: 97.5
  },
  {
    id: '3',
    originalPath: 'C:\\Program Files\\FreeApp\\helper.dll',
    threatName: 'PUP.Bundler',
    threatType: 'PUP',
    quarantinedAt: threeHoursAgo,
    size: 89000,
    hash: 'c3d4e5f6789012345678901234567890abcd1234567890abcdef123456789012',
    restored: false,
    aiConfidence: 85.2
  },
  {
    id: '4',
    originalPath: 'C:\\Windows\\System32\\tasksche.exe',
    threatName: 'Worm.WannaCry',
    threatType: 'Worm',
    quarantinedAt: sevenDaysAgo,
    size: 3500000,
    hash: 'f6789012345678901234567890abcd1234567890abcdef123456789012345678',
    restored: false,
    aiConfidence: 99.9
  },
  {
    id: '5',
    originalPath: 'C:\\Users\\Public\\Desktop\\setup.exe',
    threatName: 'Win32.Neshta',
    threatType: 'Virus',
    quarantinedAt: fourHoursAgo,
    size: 42000,
    hash: '789012345678901234567890abcd1234567890abcdef12345678901234567890',
    restored: false,
    aiConfidence: 92.3
  },
  {
    id: '6',
    originalPath: 'C:\\Windows\\Temp\\rundll32.exe',
    threatName: 'Ransom.Ryuk',
    threatType: 'Ransomware',
    quarantinedAt: sixHoursAgo,
    size: 680000,
    hash: '89012345678901234567890abcd1234567890abcdef123456789012345678901',
    restored: false,
    aiConfidence: 98.7
  },
  {
    id: '7',
    originalPath: 'C:\\Users\\Admin\\AppData\\Roaming\\Microsoft\\svchost.exe',
    threatName: 'Trojan.Zeus',
    threatType: 'Trojan',
    quarantinedAt: eightDaysAgo,
    size: 290000,
    hash: '012345678901234567890abcd1234567890abcdef12345678901234567890123',
    restored: false,
    aiConfidence: 96.4
  },
  {
    id: '8',
    originalPath: 'C:\\Users\\Admin\\Documents\\report.xls.exe',
    threatName: 'ZeroDay.StealerNova',
    threatType: 'ZeroDay',
    quarantinedAt: fourHoursAgo,
    size: 180000,
    hash: '6789012345678901234567890abcd1234567890abcdef1234567890123456789',
    restored: false,
    aiConfidence: 94.1
  }
];

// Generate mock security events
export const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    eventType: 'zero_day_blocked',
    title: 'Zero-Day Attack Blocked',
    description: 'AI detected novel ransomware variant before signature availability',
    severity: 'critical',
    timestamp: hourAgo,
    filePath: 'C:\\Windows\\Temp\\update.exe',
    aiFlagged: true
  },
  {
    id: '2',
    eventType: 'ai_detection',
    title: 'AI Behavioral Analysis Alert',
    description: 'Suspicious process behavior detected - potential keylogger activity',
    severity: 'high',
    timestamp: hourAgo,
    processName: 'svchost.exe',
    aiFlagged: true
  },
  {
    id: '3',
    eventType: 'scan_completed',
    title: 'AI Deep Scan Completed',
    description: 'Deep analysis scanned 892,450 files, found 12 threats including 2 zero-days',
    severity: 'info',
    timestamp: twoHoursAgo,
    aiFlagged: true
  },
  {
    id: '4',
    eventType: 'threat_detected',
    title: 'Trojan.Emotet Detected',
    description: 'Malicious file detected and quarantined by AI engine',
    severity: 'critical',
    timestamp: hourAgo,
    filePath: 'C:\\Users\\Admin\\Downloads\\invoice.doc.exe',
    aiFlagged: true
  },
  {
    id: '5',
    eventType: 'scan_completed',
    title: 'Quick Scan Completed',
    description: 'Scanned 24,580 files, found 3 threats',
    severity: 'info',
    timestamp: twoHoursAgo
  },
  {
    id: '6',
    eventType: 'real_time_block',
    title: 'Network Connection Blocked',
    description: 'Blocked suspicious outbound connection to 192.168.1.100:4444',
    severity: 'high',
    timestamp: twoHoursAgo,
    processName: 'svchost.exe'
  },
  {
    id: '7',
    eventType: 'quarantine_action',
    title: 'File Quarantined',
    description: 'ZeroDay.StealerNova moved to quarantine',
    severity: 'medium',
    timestamp: threeHoursAgo,
    aiFlagged: true
  },
  {
    id: '8',
    eventType: 'update_available',
    title: 'AI Model Update Available',
    description: 'New neural network model v3.2.1 ready for deployment',
    severity: 'info',
    timestamp: threeHoursAgo,
    aiFlagged: true
  },
  {
    id: '9',
    eventType: 'ai_detection',
    title: 'Anomaly Detection Alert',
    description: 'Unusual file encryption pattern detected - ransomware behavior',
    severity: 'high',
    timestamp: fourHoursAgo,
    aiFlagged: true
  },
  {
    id: '10',
    eventType: 'threat_detected',
    title: 'Spyware.KeyLogger Detected',
    description: 'Potential keylogger found in Documents folder',
    severity: 'high',
    timestamp: fourHoursAgo,
    filePath: 'C:\\Users\\Admin\\Documents\\report.xls.exe'
  },
  {
    id: '11',
    eventType: 'file_blocked',
    title: 'Malicious Script Blocked',
    description: 'PowerShell script execution blocked by behavioral analysis',
    severity: 'high',
    timestamp: fiveHoursAgo,
    processName: 'powershell.exe',
    aiFlagged: true
  },
  {
    id: '12',
    eventType: 'settings_changed',
    title: 'Settings Updated',
    description: 'AI-powered heuristics enabled for real-time protection',
    severity: 'info',
    timestamp: sixHoursAgo,
    aiFlagged: true
  },
  {
    id: '13',
    eventType: 'scan_completed',
    title: 'Full System Scan Completed',
    description: 'Scanned 892,450 files, found 7 threats',
    severity: 'info',
    timestamp: oneDayAgo
  },
  {
    id: '14',
    eventType: 'zero_day_blocked',
    title: 'Novel Exploit Blocked',
    description: 'AI detected and blocked unknown CVE exploitation attempt',
    severity: 'critical',
    timestamp: twoDaysAgo,
    aiFlagged: true
  },
  {
    id: '15',
    eventType: 'threat_detected',
    title: 'PUP.Bundler Detected',
    description: 'Potentially unwanted program detected',
    severity: 'low',
    timestamp: twoDaysAgo
  }
];

// AI Agents for proactive protection
export const mockAIAgents: AIAgent[] = [
  {
    id: '1',
    name: 'Sentinel Alpha',
    status: 'active',
    task: 'Real-time behavioral analysis',
    progress: 78,
    lastActivity: now,
    threatCount: 847,
    accuracy: 99.7
  },
  {
    id: '2',
    name: 'Guardian Beta',
    status: 'active',
    task: 'Signature synthesis & zero-day detection',
    progress: 92,
    lastActivity: hourAgo,
    threatCount: 234,
    accuracy: 98.9
  },
  {
    id: '3',
    name: 'Hunter Gamma',
    status: 'processing',
    task: 'Deep network traffic analysis',
    progress: 45,
    lastActivity: now,
    threatCount: 156,
    accuracy: 97.5
  },
  {
    id: '4',
    name: 'Sentry Delta',
    status: 'active',
    task: 'File system monitoring',
    progress: 88,
    lastActivity: twoHoursAgo,
    threatCount: 423,
    accuracy: 99.2
  }
];

// Generate mock team members
export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'Admin',
    avatar: 'SC',
    lastActive: now,
    status: 'online'
  },
  {
    id: '2',
    name: 'Michael Torres',
    email: 'michael.torres@company.com',
    role: 'Analyst',
    avatar: 'MT',
    lastActive: fiveHoursAgo,
    status: 'online'
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily.watson@company.com',
    role: 'Analyst',
    avatar: 'EW',
    lastActive: sixHoursAgo,
    status: 'away'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'Viewer',
    avatar: 'DK',
    lastActive: oneDayAgo,
    status: 'offline'
  },
  {
    id: '5',
    name: 'Jessica Brown',
    email: 'jessica.brown@company.com',
    role: 'Admin',
    avatar: 'JB',
    lastActive: fourHoursAgo,
    status: 'online'
  }
];

// Dashboard stats
export const mockDashboardStats: DashboardStats = {
  threatsBlocked: 1247,
  filesProtected: 2589347,
  activeScans: 1,
  lastScanTime: hourAgo,
  protectionEnabled: true,
  signatureVersion: '2026.02.15.001',
  lastUpdate: now,
  systemHealth: {
    cpu: 23,
    memory: 45,
    disk: 67,
    network: 12
  },
  aiStats: {
    threatsAnalyzed: 48923,
    zeroDayBlocked: 23,
    accuracy: 99.4,
    activeAgents: 4
  }
};

// Trend data for analytics (last 7 days)
export const mockThreatTrendData = [
  { date: 'Mon', threats: 12, blocked: 12, falsePositives: 1, aiDetected: 8 },
  { date: 'Tue', threats: 8, blocked: 8, falsePositives: 0, aiDetected: 6 },
  { date: 'Wed', threats: 15, blocked: 15, falsePositives: 2, aiDetected: 11 },
  { date: 'Thu', threats: 6, blocked: 6, falsePositives: 0, aiDetected: 4 },
  { date: 'Fri', threats: 22, blocked: 21, falsePositives: 1, aiDetected: 18 },
  { date: 'Sat', threats: 4, blocked: 4, falsePositives: 0, aiDetected: 3 },
  { date: 'Sun', threats: 9, blocked: 9, falsePositives: 1, aiDetected: 7 }
];

// Threat type distribution
export const mockThreatTypeDistribution = [
  { name: 'Trojan', value: 35, color: '#ef4444' },
  { name: 'Zero-Day', value: 12, color: '#dc2626' },
  { name: 'Ransomware', value: 15, color: '#f97316' },
  { name: 'Virus', value: 20, color: '#eab308' },
  { name: 'PUP', value: 18, color: '#22c55e' },
  { name: 'Adware', value: 8, color: '#3b82f6' },
  { name: 'Spyware', value: 4, color: '#8b5cf6' }
];

// Default settings
export const mockDefaultSettings = {
  protection: {
    realTimeProtection: true,
    heuristicAnalysis: true,
    networkProtection: true,
    usbScanning: true,
    sensitivity: 'high' as const,
    aiProtection: true,
    zeroDayProtection: true,
    behavioralAnalysis: true
  },
  scan: {
    scanArchives: true,
    scanEmails: false,
    maxFileSize: 50, // MB
    scanPriority: 'normal' as const,
    fileTypes: ['exe', 'dll', 'scr', 'bat', 'cmd', 'ps1', 'vbs', 'js'],
    aiDeepScan: true
  },
  notifications: {
    threatAlerts: true,
    scanComplete: true,
    updateAvailable: true,
    systemWarnings: true,
    emailNotifications: false,
    aiAlerts: true,
    zeroDayAlerts: true
  },
  updates: {
    autoUpdate: true,
    updateFrequency: 'daily' as const,
    includeBeta: false,
    aiModelUpdates: true
  },
  exclusions: [
    { id: '1', path: 'C:\\Program Files\\Steam', type: 'folder' as const, enabled: true },
    { id: '2', path: 'C:\\Games', type: 'folder' as const, enabled: true },
    { id: '3', path: '*.tmp', type: 'extension' as const, enabled: true }
  ]
};
