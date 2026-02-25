// Email Service Configuration for AdamGuard Pro
// Supports Resend, SendGrid, and other email providers

export interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'smtp';
  apiKey?: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: 'threat_alert', name: 'Threat Alert', subject: '🚨 Security Alert: Threat Detected', description: 'Sent when a new threat is detected' },
  { id: 'zero_day_alert', name: 'Zero-Day Alert', subject: '⚠️ Critical: Zero-Day Threat Blocked', description: 'Sent when AI blocks a zero-day threat' },
  { id: 'scan_complete', name: 'Scan Complete', subject: '✅ Scan Completed Successfully', description: 'Sent when a scheduled scan completes' },
  { id: 'quarantine_alert', name: 'Quarantine Alert', subject: '🔒 File Quarantined', description: 'Sent when a file is moved to quarantine' },
  { id: 'system_health', name: 'System Health', subject: '📊 System Health Report', description: 'Daily/weekly system health summary' },
  { id: 'user_invite', name: 'User Invitation', subject: ' invited you to AdamGuard Pro', description: 'Sent when inviting new team members' },
  { id: 'password_reset', name: 'Password Reset', subject: 'Reset Your Password', description: 'Sent for password reset requests' },
  { id: 'security_summary', name: 'Security Summary', subject: '📈 Weekly Security Summary', description: 'Weekly security report' },
  { id: 'license_expiry', name: 'License Expiry', subject: 'License Expiring Soon', description: 'Sent before license expires' },
  { id: 'update_available', name: 'Update Available', subject: '🔄 Update Available', description: 'Sent when new version is available' },
];

// Email notification settings per user
export interface EmailNotificationSettings {
  userId: string;
  threatAlerts: boolean;
  zeroDayAlerts: boolean;
  scanComplete: boolean;
  quarantineAlerts: boolean;
  systemHealth: boolean;
  securitySummary: boolean;
  digestFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  criticalOnly: boolean;
}

// Default notification settings
export const DEFAULT_EMAIL_SETTINGS: Omit<EmailNotificationSettings, 'userId'> = {
  threatAlerts: true,
  zeroDayAlerts: true,
  scanComplete: true,
  quarantineAlerts: true,
  systemHealth: false,
  securitySummary: true,
  digestFrequency: 'immediate',
  criticalOnly: false
};

// Email queue for batch processing
export interface EmailQueueItem {
  id: string;
  to: string[];
  templateId: string;
  data: Record<string, unknown>;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'sending' | 'sent' | 'failed';
  attempts: number;
  createdAt: Date;
  sentAt?: Date;
  error?: string;
}
