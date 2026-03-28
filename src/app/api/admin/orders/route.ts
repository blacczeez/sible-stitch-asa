import { NextRequest, NextResponse } from 'next/server'
import { mockOrders } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    let filtered = [...mockOrders]

    // Filter by status
    if (status) {
      filtered = filtered.filter((o) => o.status === status)
    }

    // Filter by search (order number or email)
    if (search) {
      const term = search.toLowerCase()
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(term) ||
          o.email.toLowerCase().includes(term)
      )
    }

    // Sort by most recent
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Pagination
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const paginatedOrders = filtered.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
