import { NextResponse } from 'next/server';
import { mockQuarantinedFiles } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(mockQuarantinedFiles);
}
