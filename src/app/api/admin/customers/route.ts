import { NextRequest, NextResponse } from 'next/server'

// Mock customer data
const mockCustomers = [
  {
    id: 'cust-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    totalOrders: 5,
    totalSpent: 1250.00,
    lastOrderAt: '2026-03-08T09:00:00Z',
    createdAt: '2025-11-15T00:00:00Z',
  },
  {
    id: 'cust-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    totalOrders: 3,
    totalSpent: 680.00,
    lastOrderAt: '2026-03-10T14:30:00Z',
    createdAt: '2025-12-01T00:00:00Z',
  },
  {
    id: 'cust-3',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    totalOrders: 2,
    totalSpent: 360.00,
    lastOrderAt: '2026-03-12T11:00:00Z',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'cust-4',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    totalOrders: 7,
    totalSpent: 2100.00,
    lastOrderAt: '2026-03-15T16:45:00Z',
    createdAt: '2025-09-20T00:00:00Z',
  },
  {
    id: 'cust-5',
    name: 'Chris Brown',
    email: 'chris.b@example.com',
    totalOrders: 1,
    totalSpent: 95.00,
    lastOrderAt: '2026-03-18T08:20:00Z',
    createdAt: '2026-03-15T00:00:00Z',
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    let filtered = [...mockCustomers]

    // Filter by search (name or email)
    if (search) {
      const term = search.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a] ?? ''
      const bVal = b[sortBy as keyof typeof b] ?? ''
      const comparison = String(aVal).localeCompare(String(bVal))
      return sortOrder === 'desc' ? -comparison : comparison
    })

    // Pagination
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const paginatedCustomers = filtered.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      customers: paginatedCustomers,
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
