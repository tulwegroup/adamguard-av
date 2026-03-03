'use client';

import { motion } from 'framer-motion';
import { Zap, HardDrive, FolderSearch, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAntivirusStore } from '@/lib/store';
import { useState } from 'react';

const scanTypes = [
  { 
    id: 'quick', 
    label: 'Quick Scan', 
    icon: Zap, 
    description: 'Scan critical system areas (2-5 min)',
    color: 'border-blue-500 bg-blue-500/10'
  },
  { 
    id: 'full', 
    label: 'Full Scan', 
    icon: HardDrive, 
    description: 'Complete system scan (30-60 min)',
    color: 'border-purple-500 bg-purple-500/10'
  },
  { 
    id: 'custom', 
    label: 'Custom Scan', 
    icon: FolderSearch, 
    description: 'Select specific folders or drives',
    color: 'border-orange-500 bg-orange-500/10'
  }
];

export function ScanPanel() {
  const { startScan, cancelScan, isScanning, activeScan } = useAntivirusStore();
  const [selectedType, setSelectedType] = useState<'quick' | 'full' | 'custom'>('quick');
  const [customPath, setCustomPath] = useState('');

  const handleStartScan = () => {
    startScan(selectedType, selectedType === 'custom' ? customPath : undefined);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Start New Scan</h3>
      
      {/* Scan type selector */}
      <div className="space-y-3 mb-6">
        {scanTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => !isScanning && setSelectedType(type.id as 'quick' | 'full' | 'custom')}
            disabled={isScanning}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              selectedType === type.id 
                ? type.color + ' border-opacity-100' 
                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
            } ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <type.icon className={`w-6 h-6 ${
                selectedType === type.id ? 'text-white' : 'text-gray-400'
              }`} />
              <div>
                <p className={`font-medium ${selectedType === type.id ? 'text-white' : 'text-gray-300'}`}>
                  {type.label}
                </p>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Custom path input */}
      {selectedType === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Label htmlFor="path" className="text-gray-300 mb-2 block">Scan Path</Label>
          <Input
            id="path"
            placeholder="C:\Users\Admin\Downloads"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            disabled={isScanning}
            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
          />
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {!isScanning ? (
          <Button
            onClick={handleStartScan}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Scan
          </Button>
        ) : (
          <Button
            onClick={cancelScan}
            variant="destructive"
            className="flex-1 py-6"
          >
            <Square className="w-5 h-5 mr-2" />
            Cancel Scan
          </Button>
        )}
      </div>

      {/* Active scan info */}
      {isScanning && activeScan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30"
        >
          <p className="text-sm text-blue-400">
            {activeScan.type.charAt(0).toUpperCase() + activeScan.type.slice(1)} scan in progress...
          </p>
          {activeScan.path && (
            <p className="text-xs text-gray-500 mt-1">Path: {activeScan.path}</p>
          )}
        </motion.div>
      )}
    </Card>
  );
}
