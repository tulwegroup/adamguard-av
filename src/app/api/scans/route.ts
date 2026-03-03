import { NextResponse } from 'next/server';
import { mockScans } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(mockScans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newScan = {
    id: Math.random().toString(36).substring(2, 9),
    type: body.type || 'quick',
    status: 'pending',
    filesScanned: 0,
    threatsFound: 0,
    filesSkipped: 0,
    startedAt: null,
    completedAt: null,
    path: body.path,
    createdAt: new Date()
  };
  
  return NextResponse.json(newScan, { status: 201 });
}
