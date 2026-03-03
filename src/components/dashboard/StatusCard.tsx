'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
}

const colorClasses = {
  green: 'from-green-500/20 to-green-600/5 border-green-500/30',
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
  orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
  red: 'from-red-500/20 to-red-600/5 border-red-500/30',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30'
};

const iconColorClasses = {
  green: 'text-green-400',
  blue: 'text-blue-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  purple: 'text-purple-400'
};

export function StatusCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'blue' 
}: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">{title}</p>
              <motion.p 
                className="text-3xl font-bold text-white mt-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </motion.p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
              {trend && trendValue && (
                <div className="flex items-center mt-2">
                  <span className={`text-xs ${
                    trend === 'up' ? 'text-green-400' : 
                    trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gray-800/50 ${iconColorClasses[color]}`}>
              <Icon className="w-8 h-8" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
