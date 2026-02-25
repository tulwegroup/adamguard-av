'use client';

import { motion } from 'framer-motion';
import { Zap, HardDrive, FolderSearch, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAntivirusStore } from '@/lib/store';

const quickActions = [
  { 
    id: 'quick-scan', 
    label: 'Quick Scan', 
    icon: Zap, 
    description: 'Scan critical areas',
    color: 'bg-blue-600 hover:bg-blue-700',
    action: 'quick' as const
  },
  { 
    id: 'full-scan', 
    label: 'Full Scan', 
    icon: HardDrive, 
    description: 'Complete system scan',
    color: 'bg-purple-600 hover:bg-purple-700',
    action: 'full' as const
  },
  { 
    id: 'custom-scan', 
    label: 'Custom Scan', 
    icon: FolderSearch, 
    description: 'Select folders',
    color: 'bg-orange-600 hover:bg-orange-700',
    action: 'custom' as const
  },
  { 
    id: 'update', 
    label: 'Update', 
    icon: Download, 
    description: 'Check for updates',
    color: 'bg-green-600 hover:bg-green-700',
    action: null
  }
];

export function QuickActions() {
  const { startScan, isScanning, setActiveTab } = useAntivirusStore();

  const handleAction = (action: 'quick' | 'full' | 'custom' | null) => {
    if (action) {
      setActiveTab('scan');
      startScan(action);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => handleAction(action.action)}
              disabled={isScanning && action.action !== null}
              className={`w-full h-auto py-4 flex flex-col items-center gap-2 ${action.color} disabled:opacity-50`}
            >
              <action.icon className="w-6 h-6" />
              <span className="font-semibold">{action.label}</span>
              <span className="text-xs opacity-80">{action.description}</span>
            </Button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Signature Database</span>
          <span className="text-green-400 font-medium">v2024.12.15.001</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-400">Last Update</span>
          <span className="text-gray-300">2 hours ago</span>
        </div>
      </div>
    </Card>
  );
}
