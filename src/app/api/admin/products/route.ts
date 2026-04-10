import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { mapProduct } from '@/lib/data/mappers'
import { createProductSchema } from '@/validations/product'
const include = {
  category: true,
  variants: true,
  reviews: { select: { rating: true } },
} satisfies Prisma.ProductInclude

export async function GET(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const where: Prisma.ProductWhereInput = {
      ...(status && status !== 'all'
        ? { status: status as 'draft' | 'published' | 'archived' }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [totalItems, rows] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      products: rows.map((p) =>
        mapProduct({
          ...p,
          reviews: p.reviews.map((r) => ({ rating: r.rating })),
        })
      ),
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
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

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

    const created = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        comparePrice:
          data.comparePrice != null
            ? new Prisma.Decimal(data.comparePrice)
            : null,
        images: data.images,
        isFeatured: data.isFeatured,
        status: data.status,
        categoryId: data.categoryId,
        variants: {
          create: data.variants.map((v) => ({
            size: v.size,
            color: v.color,
            sku: v.sku,
            stock: v.stock,
            price: v.price != null ? new Prisma.Decimal(v.price) : null,
          })),
        },
      },
      include,
    })

    return NextResponse.json(
      {
        product: mapProduct({
          ...created,
          reviews: created.reviews.map((r) => ({ rating: r.rating })),
        }),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
