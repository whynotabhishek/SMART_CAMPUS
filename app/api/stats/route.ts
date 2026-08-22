import { NextResponse } from 'next/server';
import { globalState } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    open_reports: globalState.reports.length,
    total_matches: Object.values(globalState.matches).flat().length
  });
}
