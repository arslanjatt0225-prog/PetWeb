import { NextRequest, NextResponse } from 'next/server';
import { resendVerificationEmail } from '@/PetWorld/Backend/controllers';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    const result = await resendVerificationEmail(email);
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 429 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
