import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/validations/admin'

function mapCategoryRow(
  category: {
    id: string
    slug: string
    name: string
    description: string | null
    image: string | null
    sortOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count?: { products: number }
  }
) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    image: category.image,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    productCount: category._count?.products ?? 0,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const rows = await prisma.category.findMany({
      where: active == null ? {} : { isActive: active === 'true' },
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })

    return NextResponse.json({
      categories: rows.map(mapCategoryRow),
      total: rows.length,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid category data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const created = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
        image: parsed.data.image ?? null,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
      },
      include: { _count: { select: { products: true } } },
    })

    revalidateTag('categories')

    return NextResponse.json(
      { category: mapCategoryRow(created) },
      { status: 201 }
    )
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Category slug already exists' },
        { status: 409 }
      )
    }

    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
