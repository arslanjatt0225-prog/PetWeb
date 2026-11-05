import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/PetWorld/Backend/controllers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const status = searchParams.get('status') || undefined;
    const orders = await getOrders({ userId, status });
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.items || !body.items.length) {
      return NextResponse.json({ success: false, error: 'Order must contain items' }, { status: 400 });
    }
    const order = await createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
