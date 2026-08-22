import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ 
    claim_id: `claim-${Date.now()}`, 
    verification_question: "What brand is the item?" 
  });
}
