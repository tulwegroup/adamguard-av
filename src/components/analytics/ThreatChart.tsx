'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface ThreatChartProps {
  data: Array<{
    date: string;
    threats: number;
    blocked: number;
    falsePositives: number;
  }>;
}

export function ThreatChart({ data }: ThreatChartProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Threat Detection Trend</h3>
        <p className="text-sm text-gray-400">Last 7 days</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="threats"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorThreats)"
              name="Threats Detected"
            />
            <Area
              type="monotone"
              dataKey="blocked"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorBlocked)"
              name="Blocked"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-400">Threats Detected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-400">Blocked</span>
        </div>
      </div>
    </Card>
  );
}
