import { NextResponse } from 'next/server';
import { mockDashboardStats } from '@/lib/mockData';

export async function GET() {
  // Simulate slight variations in real-time stats
  const stats = {
    ...mockDashboardStats,
    systemHealth: {
      cpu: Math.floor(20 + Math.random() * 30),
      memory: Math.floor(40 + Math.random() * 20),
      disk: mockDashboardStats.systemHealth.disk,
      network: Math.floor(5 + Math.random() * 20)
    },
    threatsBlocked: mockDashboardStats.threatsBlocked + Math.floor(Math.random() * 5),
    lastUpdate: new Date()
  };
  
  return NextResponse.json(stats);
}
