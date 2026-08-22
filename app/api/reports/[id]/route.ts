import { NextResponse } from 'next/server';
import { globalState } from '@/lib/mockData';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const report = globalState.reports.find(r => r.id === params.id);
  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(report);
}
