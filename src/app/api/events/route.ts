import { NextResponse } from 'next/server';
import { mockSecurityEvents } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  const severity = searchParams.get('severity');
  
  let events = [...mockSecurityEvents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  if (severity) {
    events = events.filter(e => e.severity === severity);
  }
  
  const paginatedEvents = events.slice(offset, offset + limit);
  
  return NextResponse.json({
    events: paginatedEvents,
    total: events.length,
    hasMore: offset + limit < events.length
  });
}
