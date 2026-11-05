import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/PetWorld/Backend/controllers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const featured = searchParams.get('featured') === 'true';
    const bestSeller = searchParams.get('bestSeller') === 'true';

    const products = await getProducts({ category, search, sort, featured, bestSeller });
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await createProduct(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
