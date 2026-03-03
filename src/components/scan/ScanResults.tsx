'use client';

import { motion } from 'framer-motion';
import { Clock, FileSearch, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ScanRecord } from '@/lib/mockData';

interface ScanResultsProps {
  scans: ScanRecord[];
}

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; textColor: string }> = {
  completed: { icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-400' },
  running: { icon: Clock, color: 'bg-blue-500', textColor: 'text-blue-400' },
  cancelled: { icon: XCircle, color: 'bg-orange-500', textColor: 'text-orange-400' },
  error: { icon: AlertTriangle, color: 'bg-red-500', textColor: 'text-red-400' },
  pending: { icon: Clock, color: 'bg-gray-500', textColor: 'text-gray-400' }
};

const typeConfig: Record<string, { label: string; color: string }> = {
  quick: { label: 'Quick Scan', color: 'bg-blue-500/20 text-blue-400' },
  full: { label: 'Full Scan', color: 'bg-purple-500/20 text-purple-400' },
  custom: { label: 'Custom Scan', color: 'bg-orange-500/20 text-orange-400' },
  ai_deep: { label: 'AI Deep Scan', color: 'bg-indigo-500/20 text-indigo-400' }
};

// Default fallbacks
const defaultStatus = { icon: Clock, color: 'bg-gray-500', textColor: 'text-gray-400' };
const defaultType = { label: 'Scan', color: 'bg-gray-500/20 text-gray-400' };

function formatScanDate(date: Date | null): string {
  if (!date) return 'N/A';
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${hours}:${minutes}`;
}

export function ScanResults({ scans }: ScanResultsProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Scan History</h3>
        <p className="text-sm text-gray-400 mt-1">Previous scan results</p>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-3">
          {scans.map((scan, index) => {
            const status = statusConfig[scan.status] || defaultStatus;
            const type = typeConfig[scan.type] || defaultType;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={type.color}>{type.label}</Badge>
                    <Badge className={`${status.color} text-white`}>
                      {scan.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatScanDate(scan.startedAt)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Files Scanned</p>
                    <p className="text-white font-medium">{scan.filesScanned.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Threats Found</p>
                    <p className={`${scan.threatsFound > 0 ? 'text-red-400' : 'text-green-400'} font-medium`}>
                      {scan.threatsFound}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Duration</p>
                    <p className="text-white font-medium">
                      {scan.duration ? `${Math.floor(scan.duration / 60)}m ${scan.duration % 60}s` : 'N/A'}
                    </p>
                  </div>
                </div>

                {scan.path && (
                  <p className="text-xs text-gray-500 mt-2 truncate">
                    Path: {scan.path}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
