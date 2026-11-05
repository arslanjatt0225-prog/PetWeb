import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailWithToken } from '@/PetWorld/Backend/controllers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ success: false, error: 'Verification token is required.' }, { status: 400 });
    }

    const result = await verifyEmailWithToken(token);
    if ('error' in result) {
      return NextResponse.json({ success: false, ...result }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Verification token is required.' }, { status: 400 });
    }

    const result = await verifyEmailWithToken(token);
    if ('error' in result) {
      return NextResponse.json({ success: false, ...result }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
