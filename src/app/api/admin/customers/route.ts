import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const grouped = await prisma.order.groupBy({
      by: ['email'],
      _count: { id: true },
      _sum: { total: true },
      _max: { createdAt: true },
      _min: { createdAt: true },
    })

    let rows = grouped.map((g) => ({
      id: g.email,
      name: g.email.split('@')[0],
      email: g.email,
      totalOrders: g._count.id,
      totalSpent: g._sum.total?.toNumber() ?? 0,
      lastOrderAt: g._max.createdAt?.toISOString() ?? '',
      createdAt: g._min.createdAt?.toISOString() ?? '',
    }))

    if (search) {
      const term = search.toLowerCase()
      rows = rows.filter(
        (c) =>
          c.email.toLowerCase().includes(term) ||
          c.name.toLowerCase().includes(term)
      )
    }

    rows.sort((a, b) => b.lastOrderAt.localeCompare(a.lastOrderAt))

    const totalItems = rows.length
    const totalPages = Math.ceil(totalItems / limit)
    const paginated = rows.slice((page - 1) * limit, page * limit)

    return NextResponse.json({
      customers: paginated,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
