import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'
import { createProductSchema } from '@/validations/product'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    let filtered = [...mockProducts]

    // Filter by status
    if (status) {
      filtered = filtered.filter((p) => p.status === status)
    }

    // Filter by search term
    if (search) {
      const term = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term)
      )
    }

    // Sort by most recently updated
    filtered.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

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
    console.error('Error fetching admin products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = createProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid product data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    // In production, this would save to the database via Prisma
    const mockCreatedProduct = {
      id: `prod-${Date.now()}`,
      slug: data.slug,
      name: data.name,
      description: data.description,
      price: data.price,
      comparePrice: data.comparePrice || null,
      images: data.images,
      isFeatured: data.isFeatured,
      status: data.status,
      categoryId: data.categoryId,
      category: { id: data.categoryId, slug: 'unknown', name: 'Unknown', description: null, image: null, sortOrder: 0 },
      variants: data.variants.map((v, i) => ({
        id: `var-new-${i}`,
        ...v,
        price: v.price || null,
      })),
      averageRating: null,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ product: mockCreatedProduct }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
