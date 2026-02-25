import { NextResponse } from 'next/server';
import { mockThreats } from '@/lib/mockData';

export async function GET() {
  const stats = {
    total: mockThreats.length,
    active: mockThreats.filter(t => t.status === 'active').length,
    quarantined: mockThreats.filter(t => t.status === 'quarantined').length,
    removed: mockThreats.filter(t => t.status === 'removed').length,
    falsePositives: mockThreats.filter(t => t.status === 'false_positive').length,
    byType: {
      virus: mockThreats.filter(t => t.type === 'Virus').length,
      trojan: mockThreats.filter(t => t.type === 'Trojan').length,
      worm: mockThreats.filter(t => t.type === 'Worm').length,
      ransomware: mockThreats.filter(t => t.type === 'Ransomware').length,
      pup: mockThreats.filter(t => t.type === 'PUP').length,
      adware: mockThreats.filter(t => t.type === 'Adware').length,
      spyware: mockThreats.filter(t => t.type === 'Spyware').length
    },
    bySeverity: {
      critical: mockThreats.filter(t => t.severity === 'Critical').length,
      high: mockThreats.filter(t => t.severity === 'High').length,
      medium: mockThreats.filter(t => t.severity === 'Medium').length,
      low: mockThreats.filter(t => t.severity === 'Low').length
    }
  };
  
  return NextResponse.json(stats);
}
