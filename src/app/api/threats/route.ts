import { NextResponse } from 'next/server';
import { mockThreats } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  
  let threats = [...mockThreats];
  
  if (status) {
    threats = threats.filter(t => t.status === status);
  }
  
  if (type) {
    threats = threats.filter(t => t.type === type);
  }
  
  return NextResponse.json(threats);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newThreat = {
    id: Math.random().toString(36).substring(2, 9),
    ...body,
    detectedAt: new Date(),
    quarantined: false
  };
  
  return NextResponse.json(newThreat, { status: 201 });
}
