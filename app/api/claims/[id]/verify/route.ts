import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { answer } = await request.json();
  if (answer && answer.length > 3) {
    return NextResponse.json({ 
      status: "verified", 
      contact_info: { name: "Demo User", email: "demo@campusfind.app", phone: "555-0192" } 
    });
  }
  return NextResponse.json({ status: "rejected" });
}
