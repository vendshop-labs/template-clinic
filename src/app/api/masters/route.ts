import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const STORE_SLUG = process.env.STORE_SLUG ?? 'kate-barber';

export async function GET() {
  try {
    const store = await db.store.findUnique({ where: { slug: STORE_SLUG } });
    if (!store) return NextResponse.json({ masters: [] });

    const masters = await db.serviceMaster.findMany({
      where: { storeId: store.id, active: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, role: true, bio: true, photo: true },
    });

    return NextResponse.json({ masters });
  } catch {
    return NextResponse.json({ masters: [] });
  }
}
