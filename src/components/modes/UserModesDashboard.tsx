'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Baby,
  Heart,
  Users,
  UserPlus,
  User,
  Shield,
  Clock,
  MapPin,
  Phone,
  Globe,
  Lock,
  Unlock,
  Eye,
  Timer,
  Smartphone,
  Bell,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  UserMode,
  DEFAULT_MODE_CONFIGS,
  type ScreenTimeConfig,
} from '@/lib/userModes';

const MODE_ICONS = {
  normal: User,
  child: Baby,
  grandparent: Heart,
  parent: Users,
  guest: UserPlus
};

const MODE_COLORS = {
  normal: 'from-gray-500 to-gray-600',
  child: 'from-pink-500 to-rose-600',
  grandparent: 'from-amber-500 to-orange-600',
  parent: 'from-blue-500 to-cyan-600',
  guest: 'from-purple-500 to-violet-600'
};

export function UserModesDashboard() {
  const [currentMode, setCurrentMode] = useState<UserMode>('normal');
  const [selectedMode, setSelectedMode] = useState<UserMode | null>(null);
  const [showModeDialog, setShowModeDialog] = useState(false);
  
  // Child mode settings
  const [screenTime, setScreenTime] = useState(120);
  const [contentFilter, setContentFilter] = useState<'light' | 'moderate' | 'strict'>('strict');
  const [safeSearch, setSafeSearch] = useState(true);
  
  // Grandparent mode settings
  const [scamProtection, setScamProtection] = useState(true);
  const [callScreening, setCallScreening] = useState(true);
  const [largeText, setLargeText] = useState(true);

  const modes = Object.values(DEFAULT_MODE_CONFIGS);

  const handleModeSwitch = (mode: UserMode) => {
    setSelectedMode(mode);
    setShowModeDialog(true);
  };

  const confirmModeSwitch = () => {
    if (selectedMode) {
      setCurrentMode(selectedMode);
    }
    setShowModeDialog(false);
    setSelectedMode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-green-400" />
            User Modes
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Specialized interfaces for every family member
          </p>
        </div>
        <Badge className={`bg-gradient-to-r ${MODE_COLORS[currentMode]} text-white px-4 py-1`}>
          Current: {DEFAULT_MODE_CONFIGS[currentMode].name}
        </Badge>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {modes.map((mode) => {
          const Icon = MODE_ICONS[mode.mode];
          const isActive = currentMode === mode.mode;
          
          return (
            <motion.div
              key={mode.mode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSwitch(mode.mode)}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                isActive
                  ? `bg-gradient-to-br ${MODE_COLORS[mode.mode]} border-transparent`
                  : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl mb-3 ${
                  isActive ? 'bg-white/20' : 'bg-gray-700/50'
                }`}>
                  <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-200'}`}>
                  {mode.name}
                </h3>
                <p className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  {mode.description.split(' ').slice(0, 4).join(' ')}...
                </p>
                {isActive && (
                  <Badge className="mt-2 bg-white/20 text-white">
                    <Check className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mode-Specific Settings */}
      <AnimatePresence mode="wait">
        {currentMode === 'child' && (
          <motion.div
            key="child-settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Baby className="w-5 h-5 text-pink-400" />
                  Child Mode Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure parental controls and screen time limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Screen Time */}
                <div className="space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Screen Time Management
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <Label className="text-gray-300">Daily Screen Time Limit</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Input
                          type="number"
                          value={screenTime}
                          onChange={(e) => setScreenTime(Number(e.target.value))}
                          className="w-24 bg-gray-700 border-gray-600"
                          min={0}
                          max={480}
                        />
                        <span className="text-gray-400">minutes</span>
                      </div>
                      <Progress value={(screenTime / 480) * 100} className="mt-2" />
                    </div>
                  </div>
                </div>

                {/* Content Filtering */}
                <div className="space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    Content Filtering
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(['light', 'moderate', 'strict'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setContentFilter(level)}
                        className={`p-3 rounded-lg border transition-all ${
                          contentFilter === level
                            ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                            : 'bg-gray-700/30 border-gray-600 text-gray-400'
                        }`}
                      >
                        <span className="font-medium capitalize">{level}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <div>
                        <Label className="text-white">Safe Search</Label>
                        <p className="text-xs text-gray-400">Filter explicit content</p>
                      </div>
                    </div>
                    <Switch checked={safeSearch} onCheckedChange={setSafeSearch} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-green-400" />
                      <div>
                        <Label className="text-white">Location Tracking</Label>
                        <p className="text-xs text-gray-400">Track for safety</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                {/* Blocked Categories */}
                <div className="p-4 bg-gray-700/30 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Blocked Content Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Adult Content', 'Violence', 'Gambling', 'Drugs', 'Weapons', 'Hate Speech', 'Social Media'].map((category) => (
                      <Badge key={category} className="bg-red-500/20 text-red-300 border border-red-500/30">
                        <X className="w-3 h-3 mr-1" />
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentMode === 'grandparent' && (
          <motion.div
            key="grandparent-settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-amber-400" />
                  Grandparent Mode Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Simplified interface with enhanced scam protection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-auto py-6 flex-col bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Shield className="w-8 h-8 mb-2" />
                    <span className="font-semibold">One-Click Scan</span>
                    <span className="text-xs opacity-80">Check your device</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex-col border-gray-600">
                    <Phone className="w-8 h-8 mb-2 text-amber-400" />
                    <span className="font-semibold">Block Scam Calls</span>
                    <span className="text-xs text-gray-400">Auto-protection</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex-col border-gray-600">
                    <Bell className="w-8 h-8 mb-2 text-blue-400" />
                    <span className="font-semibold">Alert Family</span>
                    <span className="text-xs text-gray-400">Emergency contact</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex-col border-gray-600">
                    <Users className="w-8 h-8 mb-2 text-purple-400" />
                    <span className="font-semibold">Family Sharing</span>
                    <span className="text-xs text-gray-400">Share safely</span>
                  </Button>
                </div>

                {/* Scam Protection */}
                <div className="space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Scam Protection
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-red-400" />
                        <div>
                          <Label className="text-white">Scam Call Detection</Label>
                          <p className="text-xs text-gray-400">Block known scam numbers</p>
                        </div>
                      </div>
                      <Switch checked={callScreening} onCheckedChange={setCallScreening} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-amber-400" />
                        <div>
                          <Label className="text-white">Email Scam Alerts</Label>
                          <p className="text-xs text-gray-400">Warn about suspicious emails</p>
                        </div>
                      </div>
                      <Switch checked={scamProtection} onCheckedChange={setScamProtection} />
                    </div>
                  </div>
                </div>

                {/* Accessibility */}
                <div className="space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-400" />
                    Accessibility Options
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-xl font-bold text-white">Aa</div>
                        <div>
                          <Label className="text-white">Large Text</Label>
                          <p className="text-xs text-gray-400">Increase font size</p>
                        </div>
                      </div>
                      <Switch checked={largeText} onCheckedChange={setLargeText} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-black to-white" />
                        <div>
                          <Label className="text-white">High Contrast</Label>
                          <p className="text-xs text-gray-400">Better visibility</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentMode === 'parent' && (
          <motion.div
            key="parent-settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Parent Mode - Family Dashboard
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor and manage all family members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Family Members */}
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Family Members</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Sarah', mode: 'child', status: 'Online', screenTime: 45 },
                      { name: 'Grandma Mary', mode: 'grandparent', status: 'Online', screenTime: null },
                      { name: 'John', mode: 'parent', status: 'Away', screenTime: null }
                    ].map((member) => (
                      <div key={member.name} className="p-4 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{member.name}</span>
                          <Badge className={`${
                            member.status === 'Online' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {member.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          {member.mode === 'child' && <Baby className="w-4 h-4 text-pink-400" />}
                          {member.mode === 'grandparent' && <Heart className="w-4 h-4 text-amber-400" />}
                          {member.mode === 'parent' && <Users className="w-4 h-4 text-blue-400" />}
                          <span className="capitalize">{member.mode} Mode</span>
                        </div>
                        {member.screenTime !== null && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">Screen time today</p>
                            <Progress value={(member.screenTime / 120) * 100} className="mt-1" />
                            <p className="text-xs text-gray-400 mt-1">{member.screenTime} / 120 min</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="border-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-green-400" />
                    Track Location
                  </Button>
                  <Button variant="outline" className="border-gray-600">
                    <Timer className="w-4 h-4 mr-2 text-blue-400" />
                    Screen Time
                  </Button>
                  <Button variant="outline" className="border-gray-600">
                    <Smartphone className="w-4 h-4 mr-2 text-purple-400" />
                    Device Mgmt
                  </Button>
                  <Button variant="outline" className="border-gray-600">
                    <Bell className="w-4 h-4 mr-2 text-amber-400" />
                    Emergency Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentMode === 'guest' && (
          <motion.div
            key="guest-settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-400" />
                  Guest Mode
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Temporary isolated access with automatic cleanup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 inline-block">
                    <Timer className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">Session Time Remaining</p>
                    <p className="text-3xl font-bold text-purple-400 mt-2">58:42</p>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <Lock className="w-5 h-5 text-red-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">No File Access</p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <Lock className="w-5 h-5 text-red-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">No Installations</p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <Unlock className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Web Browsing</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-6 border-red-500/30 text-red-400 hover:bg-red-500/10">
                    End Session Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Switch Confirmation Dialog */}
      <Dialog open={showModeDialog} onOpenChange={setShowModeDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Switch to {selectedMode && DEFAULT_MODE_CONFIGS[selectedMode].name}?</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedMode && DEFAULT_MODE_CONFIGS[selectedMode].description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMode && (
            <div className="py-4">
              <p className="text-sm text-gray-300 mb-4">Features available:</p>
              <div className="space-y-2">
                {DEFAULT_MODE_CONFIGS[selectedMode].features.slice(0, 5).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModeDialog(false)} className="border-gray-600">
              Cancel
            </Button>
            <Button onClick={confirmModeSwitch} className="bg-green-600 hover:bg-green-700">
              Switch Mode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
