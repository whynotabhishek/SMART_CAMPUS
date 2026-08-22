import { NextResponse } from 'next/server';
import { globalState } from '@/lib/mockData';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // If we don't have matches for this mock, generate some fake ones
  let matches = globalState.matches[params.id];
  if (!matches) {
    const report = globalState.reports.find(r => r.id === params.id);
    if (!report) return NextResponse.json({ report_id: params.id, matches: [] });
    
    // Find opposite type
    const opposites = globalState.reports.filter(r => r.type !== report.type);
    matches = opposites.slice(0, 2).map((opp, i) => ({
      id: `match-${Date.now()}-${i}`,
      matched_report: opp,
      overall_score: 85 - (i * 10),
      scores: { visual_score: 0.9, text_score: 0.8, location_score: 0.7, time_score: 1.0 },
      explanation: "Generated hackathon match."
    }));
    globalState.matches[params.id] = matches;
  }
  
  return NextResponse.json({ report_id: params.id, matches });
}
