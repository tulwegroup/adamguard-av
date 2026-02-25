'use client';

import { motion } from 'framer-motion';
import { Shield, Scan, Bell, Download, FolderX, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAntivirusStore } from '@/lib/store';
import { useState } from 'react';

export function SettingsPanel() {
  const { settings, updateSettings, addExclusion, removeExclusion, toggleExclusion } = useAntivirusStore();
  const [newExclusionPath, setNewExclusionPath] = useState('');
  const [newExclusionType, setNewExclusionType] = useState<'file' | 'folder' | 'extension'>('folder');

  const handleAddExclusion = () => {
    if (newExclusionPath.trim()) {
      addExclusion({
        id: Math.random().toString(36).substring(7),
        path: newExclusionPath.trim(),
        type: newExclusionType,
        enabled: true
      });
      setNewExclusionPath('');
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <Tabs defaultValue="protection" className="w-full">
        <div className="p-6 border-b border-gray-700">
          <TabsList className="bg-gray-900/50 w-full grid grid-cols-4">
            <TabsTrigger value="protection" className="data-[state=active]:bg-green-600">
              <Shield className="w-4 h-4 mr-2" />
              Protection
            </TabsTrigger>
            <TabsTrigger value="scan" className="data-[state=active]:bg-blue-600">
              <Scan className="w-4 h-4 mr-2" />
              Scan
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="updates" className="data-[state=active]:bg-orange-600">
              <Download className="w-4 h-4 mr-2" />
              Updates
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Protection Settings */}
        <TabsContent value="protection" className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Real-time Protection</Label>
                <p className="text-sm text-gray-400">Monitor system in real-time</p>
              </div>
              <Switch
                checked={settings.protection.realTimeProtection}
                onCheckedChange={(checked) => updateSettings('protection', 'realTimeProtection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Heuristic Analysis</Label>
                <p className="text-sm text-gray-400">Detect unknown threats</p>
              </div>
              <Switch
                checked={settings.protection.heuristicAnalysis}
                onCheckedChange={(checked) => updateSettings('protection', 'heuristicAnalysis', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Network Protection</Label>
                <p className="text-sm text-gray-400">Block malicious network activity</p>
              </div>
              <Switch
                checked={settings.protection.networkProtection}
                onCheckedChange={(checked) => updateSettings('protection', 'networkProtection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">USB Scanning</Label>
                <p className="text-sm text-gray-400">Scan removable drives on connection</p>
              </div>
              <Switch
                checked={settings.protection.usbScanning}
                onCheckedChange={(checked) => updateSettings('protection', 'usbScanning', checked)}
              />
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-white">Sensitivity Level</Label>
                <p className="text-sm text-gray-400">Detection sensitivity</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Low</span>
                <Slider
                  value={settings.protection.sensitivity === 'low' ? [0] : settings.protection.sensitivity === 'medium' ? [50] : [100]}
                  onValueChange={(value) => {
                    const level = value[0] <= 33 ? 'low' : value[0] <= 66 ? 'medium' : 'high';
                    updateSettings('protection', 'sensitivity', level);
                  }}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-400">High</span>
              </div>
              <p className="text-xs text-gray-500">Current: {settings.protection.sensitivity.charAt(0).toUpperCase() + settings.protection.sensitivity.slice(1)}</p>
            </div>
          </div>
        </TabsContent>

        {/* Scan Settings */}
        <TabsContent value="scan" className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Scan Archives</Label>
                <p className="text-sm text-gray-400">Scan inside zip, rar, etc.</p>
              </div>
              <Switch
                checked={settings.scan.scanArchives}
                onCheckedChange={(checked) => updateSettings('scan', 'scanArchives', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Scan Email Attachments</Label>
                <p className="text-sm text-gray-400">Check email files</p>
              </div>
              <Switch
                checked={settings.scan.scanEmails}
                onCheckedChange={(checked) => updateSettings('scan', 'scanEmails', checked)}
              />
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-white">Max File Size (MB)</Label>
                <p className="text-sm text-gray-400">Skip files larger than this</p>
              </div>
              <Input
                type="number"
                value={settings.scan.maxFileSize}
                onChange={(e) => updateSettings('scan', 'maxFileSize', parseInt(e.target.value))}
                className="bg-gray-900 border-gray-700 text-white w-32"
              />
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-white">Scan Priority</Label>
                <p className="text-sm text-gray-400">CPU priority for scans</p>
              </div>
              <div className="flex gap-2">
                {(['low', 'normal', 'high'] as const).map((priority) => (
                  <Button
                    key={priority}
                    size="sm"
                    variant={settings.scan.scanPriority === priority ? 'default' : 'outline'}
                    onClick={() => updateSettings('scan', 'scanPriority', priority)}
                    className={settings.scan.scanPriority === priority ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Exclusions */}
          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-white font-medium mb-4">Exclusions</h4>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Path to exclude..."
                value={newExclusionPath}
                onChange={(e) => setNewExclusionPath(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white flex-1"
              />
              <select
                value={newExclusionType}
                onChange={(e) => setNewExclusionType(e.target.value as 'file' | 'folder' | 'extension')}
                className="bg-gray-900 border border-gray-700 rounded-md px-3 text-gray-300"
              >
                <option value="file">File</option>
                <option value="folder">Folder</option>
                <option value="extension">Extension</option>
              </select>
              <Button onClick={handleAddExclusion} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {settings.exclusions.map((exclusion) => (
                <div
                  key={exclusion.id}
                  className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={exclusion.enabled}
                      onCheckedChange={() => toggleExclusion(exclusion.id)}
                    />
                    <div>
                      <p className="text-sm text-white">{exclusion.path}</p>
                      <p className="text-xs text-gray-500">{exclusion.type}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeExclusion(exclusion.id)}
                    className="text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Threat Alerts</Label>
              <p className="text-sm text-gray-400">Notify when threats detected</p>
            </div>
            <Switch
              checked={settings.notifications.threatAlerts}
              onCheckedChange={(checked) => updateSettings('notifications', 'threatAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Scan Complete</Label>
              <p className="text-sm text-gray-400">Notify when scan finishes</p>
            </div>
            <Switch
              checked={settings.notifications.scanComplete}
              onCheckedChange={(checked) => updateSettings('notifications', 'scanComplete', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Update Available</Label>
              <p className="text-sm text-gray-400">Notify about new updates</p>
            </div>
            <Switch
              checked={settings.notifications.updateAvailable}
              onCheckedChange={(checked) => updateSettings('notifications', 'updateAvailable', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">System Warnings</Label>
              <p className="text-sm text-gray-400">Security warnings</p>
            </div>
            <Switch
              checked={settings.notifications.systemWarnings}
              onCheckedChange={(checked) => updateSettings('notifications', 'systemWarnings', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Email Notifications</Label>
              <p className="text-sm text-gray-400">Send alerts to email</p>
            </div>
            <Switch
              checked={settings.notifications.emailNotifications}
              onCheckedChange={(checked) => updateSettings('notifications', 'emailNotifications', checked)}
            />
          </div>
        </TabsContent>

        {/* Updates */}
        <TabsContent value="updates" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Auto Update</Label>
              <p className="text-sm text-gray-400">Automatically download updates</p>
            </div>
            <Switch
              checked={settings.updates.autoUpdate}
              onCheckedChange={(checked) => updateSettings('updates', 'autoUpdate', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Include Beta Versions</Label>
              <p className="text-sm text-gray-400">Get early access updates</p>
            </div>
            <Switch
              checked={settings.updates.includeBeta}
              onCheckedChange={(checked) => updateSettings('updates', 'includeBeta', checked)}
            />
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-white">Update Frequency</Label>
              <p className="text-sm text-gray-400">How often to check</p>
            </div>
            <div className="flex gap-2">
              {(['hourly', 'daily', 'weekly'] as const).map((freq) => (
                <Button
                  key={freq}
                  size="sm"
                  variant={settings.updates.updateFrequency === freq ? 'default' : 'outline'}
                  onClick={() => updateSettings('updates', 'updateFrequency', freq)}
                  className={settings.updates.updateFrequency === freq ? 'bg-green-600' : 'border-gray-600 text-gray-300'}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
