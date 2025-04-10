import { NextResponse } from 'next/server';
import { requireAuth } from '../../lib/apiAuth';
import { prisma } from '../../lib/prisma';

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request as any);
    if (user instanceof NextResponse) return user;

    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const search = searchParams.get('search');

    const where = {
      ...(sector && { sector }),
      ...(search && {
        OR: [
          { symbol: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const stocks = await prisma.stock.findMany({
      where,
      orderBy: {
        symbol: 'asc'
      }
    });

    return NextResponse.json({ stocks });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
} 