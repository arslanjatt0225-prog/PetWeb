import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/PetWorld/Backend/controllers';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const result = await subscribeNewsletter(email);
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
