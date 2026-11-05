import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/PetWorld/Backend/controllers';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    const result = await registerUser({ name, email, password, phone });
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
      requiresVerification: result.requiresVerification,
      message: result.message,
      previewVerifyLink: result.previewVerifyLink,
    }, { status: 201 });
    response.cookies.set('petworld_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
