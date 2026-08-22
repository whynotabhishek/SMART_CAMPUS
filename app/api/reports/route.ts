import { NextResponse } from 'next/server';
import { globalState } from '@/lib/mockData';
import type { Report } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const location_zone = searchParams.get('location_zone');
  const search = searchParams.get('search');

  let filtered = [...globalState.reports];
  if (type) filtered = filtered.filter(r => r.type === type);
  if (category) filtered = filtered.filter(r => r.category === category);
  if (location_zone) filtered = filtered.filter(r => r.location_zone === location_zone);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(r => r.title.toLowerCase().includes(s) || r.description.toLowerCase().includes(s));
  }
  
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newReport: Report = {
      id: `mock-${Date.now()}`,
      ...data,
      image_url: data.image_base64 ? 'attached' : null,
      contact_phone: data.contact_phone || null,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to our global state
    globalState.reports.unshift(newReport);
    
    // Generate a fake match if it's a found item
    const matches = [];
    if (data.type === 'found') {
      matches.push({
        id: `match-${Date.now()}`,
        matched_report: globalState.reports.find(r => r.type === 'lost') || globalState.reports[0],
        overall_score: 92.5,
        scores: { visual_score: 0.9, text_score: 0.95, location_score: 1.0, time_score: 0.8 },
        explanation: "Strong match based on AI semantic analysis."
      });
    }
    
    return NextResponse.json({ report: newReport, matches });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
