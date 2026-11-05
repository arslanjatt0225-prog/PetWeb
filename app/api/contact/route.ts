import { NextRequest, NextResponse } from 'next/server';
import { sendContactMessage } from '@/PetWorld/Backend/controllers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ success: false, error: 'Name, email, and message are required' }, { status: 400 });
    }
    const result = await sendContactMessage(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
