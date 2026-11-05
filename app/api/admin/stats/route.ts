import { NextResponse } from 'next/server';
import { getAdminDashboardStats } from '@/PetWorld/Backend/controllers';

export async function GET() {
  try {
    const stats = await getAdminDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
