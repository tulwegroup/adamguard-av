'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Scan, 
  Lock, 
  BarChart3, 
  Settings, 
  Users,
  Bell,
  Menu,
  X,
  Brain,
  UserCog,
  Heart,
  CreditCard
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAntivirusStore } from '@/lib/store';

// Dashboard Components
import { StatusCard } from '@/components/dashboard/StatusCard';
import { ProtectionStatus } from '@/components/dashboard/ProtectionStatus';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

// Scan Components
import { ScanPanel } from '@/components/scan/ScanPanel';
import { ScanProgress } from '@/components/scan/ScanProgress';
import { ScanResults } from '@/components/scan/ScanResults';

// Quarantine Components
import { QuarantineList } from '@/components/quarantine/QuarantineList';

// Analytics Components
import { ThreatChart } from '@/components/analytics/ThreatChart';
import { DetectionPieChart } from '@/components/analytics/DetectionPieChart';

// Settings Components
import { SettingsPanel } from '@/components/settings/SettingsPanel';

// Team Components
import { TeamActivity } from '@/components/team/TeamActivity';

// AI Components
import { AIAgentPanel } from '@/components/ai/AIAgentPanel';
import { ZeroDayPanel } from '@/components/ai/ZeroDayPanel';

// Admin Components
import { SuperAdminDashboard } from '@/components/admin/SuperAdminDashboard';

// Modes Components
import { UserModesDashboard } from '@/components/modes/UserModesDashboard';

// Pricing Components
import { PricingPage } from '@/components/pricing/PricingPage';

// License Components
import { LicenseBanner, ProStatusBadge } from '@/components/license/LicenseComponents';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Shield },
  { id: 'scan', label: 'Scan', icon: Scan },
  { id: 'quarantine', label: 'Quarantine', icon: Lock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ai', label: 'AI Protection', icon: Brain },
  { id: 'modes', label: 'User Modes', icon: Heart },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'admin', label: 'Admin', icon: UserCog },
];

export default function AntivirusDashboard() {
  const { 
    activeTab, 
    setActiveTab, 
    stats, 
    events, 
    scans,
    quarantinedFiles,
    trendData,
    typeDistribution,
    unreadCount,
    teamMembers,
    restoreFromQuarantine,
    deleteFromQuarantine,
    license
  } = useAntivirusStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLicenseBanner, setShowLicenseBanner] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-400"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  AdamGuard Pro
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Antivirus</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* License Status Badge */}
            <ProStatusBadge tier={license.tier} />

            {/* AI Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-300">AI Active</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-gray-400 relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Version Badge */}
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hidden sm:block">
              v2026.02.15
            </Badge>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-[65px] bottom-0 w-56 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 z-40 hidden lg:block">
        {/* Protection Status */}
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Protected</span>
            </div>
            <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
              {stats.signatureVersion}
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-400 border border-green-500/30'
                  : item.id === 'ai'
                  ? 'text-purple-400 hover:text-white hover:bg-purple-500/10'
                  : item.id === 'admin'
                  ? 'text-cyan-400 hover:text-white hover:bg-cyan-500/10'
                  : item.id === 'modes'
                  ? 'text-pink-400 hover:text-white hover:bg-pink-500/10'
                  : item.id === 'pricing'
                  ? 'text-amber-400 hover:text-white hover:bg-amber-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-[65px] bottom-0 w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 z-50 lg:hidden overflow-y-auto"
            >
              <nav className="p-3 space-y-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-400 border border-green-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-[65px] min-h-screen lg:ml-56">
        <div className="p-4 lg:p-6">
          {/* License Banner for Trial Users */}
          {showLicenseBanner && license.tier === 'trial' && (
            <div className="mb-6">
              <LicenseBanner 
                tier={license.tier} 
                daysRemaining={license.daysRemaining}
                onDismiss={() => setShowLicenseBanner(false)}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatusCard
                    title="Files Protected"
                    value={stats.filesProtected}
                    subtitle="Total scanned"
                    icon={Shield}
                    color="green"
                    trend="up"
                    trendValue="+2.5k today"
                  />
                  <StatusCard
                    title="Threats Blocked"
                    value={stats.threatsBlocked}
                    subtitle="All time"
                    icon={Lock}
                    color="red"
                    trend="up"
                    trendValue="+5 today"
                  />
                  <StatusCard
                    title="System Health"
                    value={`${stats.systemHealth.cpu}%`}
                    subtitle="CPU usage"
                    icon={BarChart3}
                    color="blue"
                  />
                  <StatusCard
                    title="Last Scan"
                    value={stats.lastScanTime ? 'Today' : 'Never'}
                    subtitle={stats.lastScanTime ? 'Quick scan' : 'Run a scan'}
                    icon={Scan}
                    color="purple"
                  />
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                      <ProtectionStatus />
                    </div>
                  </div>
                  <div>
                    <QuickActions />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <SystemHealth 
                      cpu={stats.systemHealth.cpu}
                      memory={stats.systemHealth.memory}
                      disk={stats.systemHealth.disk}
                      network={stats.systemHealth.network}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <RecentActivity events={events} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Scan Tab */}
            {activeTab === 'scan' && (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <ScanPanel />
                    <ScanProgress />
                  </div>
                  <div>
                    <ScanResults scans={scans} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quarantine Tab */}
            {activeTab === 'quarantine' && (
              <motion.div
                key="quarantine"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QuarantineList 
                  files={quarantinedFiles}
                  onRestore={restoreFromQuarantine}
                  onDelete={deleteFromQuarantine}
                />
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ThreatChart data={trendData} />
                  <DetectionPieChart data={typeDistribution} />
                </div>
              </motion.div>
            )}

            {/* AI Protection Tab */}
            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <AIAgentPanel />
                <ZeroDayPanel />
              </motion.div>
            )}

            {/* User Modes Tab */}
            {activeTab === 'modes' && (
              <motion.div
                key="modes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <UserModesDashboard />
              </motion.div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PricingPage />
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SettingsPanel />
              </motion.div>
            )}

            {/* Admin Tab */}
            {activeTab === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SuperAdminDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 lg:hidden z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? item.id === 'ai' 
                    ? 'text-purple-400' 
                    : 'text-green-400'
                  : 'text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
