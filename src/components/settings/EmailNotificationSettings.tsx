'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Bell,
  Shield,
  AlertTriangle,
  Brain,
  Clock,
  Send,
  Settings,
  CheckCircle,
  XCircle,
  TestTube,
  Save,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { EMAIL_TEMPLATES, DEFAULT_EMAIL_SETTINGS, type EmailNotificationSettings } from '@/lib/email-config';

export function EmailNotificationSettings() {
  const [settings, setSettings] = useState<Omit<EmailNotificationSettings, 'userId'>>(DEFAULT_EMAIL_SETTINGS);
  const [emailConfig, setEmailConfig] = useState<{
    provider: 'resend' | 'sendgrid' | 'smtp';
    fromEmail: string;
    fromName: string;
    replyTo: string;
  }>({
    provider: 'resend',
    fromEmail: 'security@adamguard.pro',
    fromName: 'AdamGuard Pro Security',
    replyTo: 'noreply@adamguard.pro'
  });
  const [testEmail, setTestEmail] = useState('');
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSendTestEmail = async () => {
    setIsSending(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: [testEmail],
          template: 'test_email',
          data: {
            name: 'Test User',
            message: 'This is a test email from AdamGuard Pro',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch {
      setTestResult('error');
    } finally {
      setIsSending(false);
    }
  };

  const notificationTypes = [
    {
      key: 'threatAlerts' as const,
      icon: AlertTriangle,
      label: 'Threat Alerts',
      description: 'Receive alerts when new threats are detected',
      color: 'text-red-400'
    },
    {
      key: 'zeroDayAlerts' as const,
      icon: Brain,
      label: 'Zero-Day Alerts',
      description: 'Critical alerts when AI blocks zero-day threats',
      color: 'text-purple-400'
    },
    {
      key: 'scanComplete' as const,
      icon: CheckCircle,
      label: 'Scan Completion',
      description: 'Notifications when scheduled scans finish',
      color: 'text-green-400'
    },
    {
      key: 'quarantineAlerts' as const,
      icon: Shield,
      label: 'Quarantine Alerts',
      description: 'Alerts when files are moved to quarantine',
      color: 'text-yellow-400'
    },
    {
      key: 'systemHealth' as const,
      icon: Settings,
      label: 'System Health Reports',
      description: 'Daily/weekly system health summaries',
      color: 'text-blue-400'
    },
    {
      key: 'securitySummary' as const,
      icon: Bell,
      label: 'Security Summary',
      description: 'Weekly security report digest',
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-green-400" />
            Email Notification Settings
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Configure email alerts and notification preferences
          </p>
        </div>

        <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-gray-600 text-gray-200">
              <TestTube className="w-4 h-4 mr-2" />
              Send Test Email
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Send Test Email</DialogTitle>
              <DialogDescription className="text-gray-400">
                Send a test email to verify your email configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Recipient Email</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="test@example.com"
                />
              </div>
              {testResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    testResult === 'success'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {testResult === 'success' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Test email sent successfully!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Failed to send test email
                    </>
                  )}
                </motion.div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
                Close
              </Button>
              <Button
                onClick={handleSendTestEmail}
                disabled={!testEmail || isSending}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Email Provider Configuration */}
      <Card className="bg-gray-800/30 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-400" />
            Email Provider Configuration
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure your email service provider settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email Provider</Label>
              <Select
                value={emailConfig.provider}
                onValueChange={(value: 'resend' | 'sendgrid' | 'smtp') =>
                  setEmailConfig({ ...emailConfig, provider: value })
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="resend">Resend</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="smtp">Custom SMTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From Email</Label>
              <Input
                value={emailConfig.fromEmail}
                onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="security@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>From Name</Label>
              <Input
                value={emailConfig.fromName}
                onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="AdamGuard Security"
              />
            </div>
            <div className="space-y-2">
              <Label>Reply-To Email</Label>
              <Input
                value={emailConfig.replyTo}
                onChange={(e) => setEmailConfig({ ...emailConfig, replyTo: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="noreply@example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-gray-800/30 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-400" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-gray-400">
            Choose which alerts you want to receive via email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <motion.div
                key={type.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <type.icon className={`w-5 h-5 ${type.color}`} />
                  <div>
                    <Label className="text-white font-medium">{type.label}</Label>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[type.key]}
                  onCheckedChange={() => handleToggle(type.key)}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Settings */}
      <Card className="bg-gray-800/30 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-400" />
            Delivery Settings
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure when and how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-700/30 rounded-lg">
            <div>
              <Label className="text-white font-medium">Digest Frequency</Label>
              <p className="text-sm text-gray-400">
                How often to receive notification digests
              </p>
            </div>
            <Select
              value={settings.digestFrequency}
              onValueChange={(value: 'immediate' | 'hourly' | 'daily' | 'weekly') =>
                setSettings({ ...settings, digestFrequency: value })
              }
            >
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div>
              <Label className="text-white font-medium">Critical Only Mode</Label>
              <p className="text-sm text-gray-400">
                Only receive emails for critical threats
              </p>
            </div>
            <Switch
              checked={settings.criticalOnly}
              onCheckedChange={() => handleToggle('criticalOnly')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Templates Preview */}
      <Card className="bg-gray-800/30 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-400" />
            Email Templates
          </CardTitle>
          <CardDescription className="text-gray-400">
            Available email notification templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EMAIL_TEMPLATES.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white">{template.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Subject: {template.subject}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {template.id}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
