'use client';

import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface ThreatTypeDistribution {
  name: string;
  value: number;
  color: string;
}

interface DetectionPieChartProps {
  data: ThreatTypeDistribution[];
}

export function DetectionPieChart({ data }: DetectionPieChartProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Threat Distribution</h3>
        <p className="text-sm text-gray-400">By type</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value}%`, 'Percentage']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-400">{item.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
