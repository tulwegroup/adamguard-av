'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, Clock, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SecurityEvent } from '@/lib/mockData';

interface RecentActivityProps {
  events: SecurityEvent[];
}

const severityConfig = {
  critical: { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10' },
  high: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  medium: { icon: Info, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  low: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  info: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' }
};

function formatRelativeTime(date: Date): string {
  const eventDate = new Date(date);
  const baseDate = new Date('2024-12-15T12:00:00.000Z'); // Fixed base date
  const diffMs = baseDate.getTime() - eventDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return eventDate.toLocaleDateString();
}

export function RecentActivity({ events }: RecentActivityProps) {
  const displayEvents = events.slice(0, 10);

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <p className="text-sm text-gray-400 mt-1">Latest security events</p>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-3">
          {displayEvents.map((event, index) => {
            const config = severityConfig[event.severity];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg ${config.bg} border border-gray-700/50`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gray-800 ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs ${config.color} uppercase font-medium`}>
                        {event.severity}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
