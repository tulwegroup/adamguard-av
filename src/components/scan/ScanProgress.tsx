'use client';

import { motion } from 'framer-motion';
import { FileSearch, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAntivirusStore } from '@/lib/store';

export function ScanProgress() {
  const { scanProgress, isScanning, activeScan } = useAntivirusStore();

  if (!isScanning && scanProgress === 0) {
    return null;
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {isScanning ? 'Scanning...' : 'Scan Complete'}
        </h3>
        <span className="text-2xl font-bold text-blue-400">
          {Math.round(scanProgress)}%
        </span>
      </div>

      {/* Animated progress bar */}
      <div className="relative mb-6">
        <Progress value={scanProgress} className="h-3 bg-gray-700" />
        {isScanning && (
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
          />
        )}
      </div>

      {/* Scan stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-lg p-3 text-center"
        >
          <FileSearch className="w-6 h-6 text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">
            {activeScan?.filesScanned.toLocaleString() || 0}
          </p>
          <p className="text-xs text-gray-400">Files Scanned</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 rounded-lg p-3 text-center"
        >
          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">
            {activeScan?.threatsFound || 0}
          </p>
          <p className="text-xs text-gray-400">Threats Found</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 rounded-lg p-3 text-center"
        >
          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">
            {activeScan?.filesSkipped.toLocaleString() || 0}
          </p>
          <p className="text-xs text-gray-400">Files Skipped</p>
        </motion.div>
      </div>

      {/* Scanning animation */}
      {isScanning && (
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <FileSearch className="w-4 h-4" />
          </motion.div>
          <span className="text-sm">Analyzing files...</span>
        </div>
      )}

      {/* Completion message */}
      {!isScanning && scanProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg ${
            (activeScan?.threatsFound || 0) > 0 
              ? 'bg-orange-500/10 border border-orange-500/30' 
              : 'bg-green-500/10 border border-green-500/30'
          }`}
        >
          <p className={`font-medium ${
            (activeScan?.threatsFound || 0) > 0 ? 'text-orange-400' : 'text-green-400'
          }`}>
            {(activeScan?.threatsFound || 0) > 0 
              ? `Scan complete. ${activeScan?.threatsFound} threat(s) found.` 
              : 'Scan complete. No threats detected.'}
          </p>
        </motion.div>
      )}
    </Card>
  );
}
