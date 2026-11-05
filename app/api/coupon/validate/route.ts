import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/PetWorld/Backend/controllers';

export async function POST(req: NextRequest) {
  try {
    const { code, total } = await req.json();
    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code required' }, { status: 400 });
    }
    const result = await validateCoupon(code, Number(total) || 0);
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
