import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'
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
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { category, search, minPrice, maxPrice, size, color, sort, page, limit } = parsed.data

    let filtered = [...mockProducts].filter((p) => p.status === 'published')

    // Filter by category slug
    if (category) {
      filtered = filtered.filter((p) => p.category.slug === category)
    }

    // Filter by search term
    if (search) {
      const term = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      )
    }

    // Filter by price range
    if (minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= minPrice)
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= maxPrice)
    }

    // Filter by size
    if (size) {
      filtered = filtered.filter((p) =>
        p.variants.some((v) => v.size.toLowerCase() === size.toLowerCase() && v.stock > 0)
      )
    }

    // Filter by color
    if (color) {
      filtered = filtered.filter((p) =>
        p.variants.some((v) => v.color.toLowerCase() === color.toLowerCase() && v.stock > 0)
      )
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'newest':
      default:
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
    }

    // Pagination
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const paginatedProducts = filtered.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      products: paginatedProducts,
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
