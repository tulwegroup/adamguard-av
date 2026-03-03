import { NextResponse } from 'next/server';
import { mockTeamMembers } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(mockTeamMembers);
}
