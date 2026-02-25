'use client';

import { motion } from 'framer-motion';
import { Cpu, HardDrive, MemoryStick, Wifi } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SystemHealthProps {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

const metrics = [
  { id: 'cpu', label: 'CPU Usage', icon: Cpu, color: 'text-blue-400', bgColor: 'bg-blue-400' },
  { id: 'memory', label: 'Memory', icon: MemoryStick, color: 'text-purple-400', bgColor: 'bg-purple-400' },
  { id: 'disk', label: 'Disk', icon: HardDrive, color: 'text-orange-400', bgColor: 'bg-orange-400' },
  { id: 'network', label: 'Network', icon: Wifi, color: 'text-green-400', bgColor: 'bg-green-400' },
];

export function SystemHealth({ cpu, memory, disk, network }: SystemHealthProps) {
  const values = { cpu, memory, disk, network };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm p-6">
      <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                <span className="text-sm text-gray-300">{metric.label}</span>
              </div>
              <span className={`text-sm font-medium ${metric.color}`}>
                {values[metric.id as keyof typeof values]}%
              </span>
            </div>
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${values[metric.id as keyof typeof values]}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`absolute inset-y-0 left-0 ${metric.bgColor} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Overall Status</span>
          <span className="text-sm font-medium text-green-400">Healthy</span>
        </div>
      </div>
    </Card>
  );
}
