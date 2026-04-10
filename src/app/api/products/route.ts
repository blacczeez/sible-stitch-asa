import { NextRequest, NextResponse } from 'next/server'
import { listProducts } from '@/lib/data/products'
import { productQuerySchema } from '@/validations/product'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const parsed = productQuerySchema.safeParse({
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      size: searchParams.get('size') || undefined,
      color: searchParams.get('color') || undefined,
      sort: searchParams.get('sort') || undefined,
      ids: searchParams.get('ids') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { page, limit } = parsed.data
    const { products, totalItems } = await listProducts(parsed.data)

    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
