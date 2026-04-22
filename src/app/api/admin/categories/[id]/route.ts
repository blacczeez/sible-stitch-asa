import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import {
  deleteFromCloudinary,
  extractCloudinaryPublicId,
  isCloudinaryConfigured,
} from '@/lib/cloudinary'
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = categorySchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid category data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
        ...(parsed.data.slug !== undefined ? { slug: parsed.data.slug } : {}),
        ...(parsed.data.description !== undefined
          ? { description: parsed.data.description ?? null }
          : {}),
        ...(parsed.data.image !== undefined
          ? { image: parsed.data.image ?? null }
          : {}),
        ...(parsed.data.sortOrder !== undefined
          ? { sortOrder: parsed.data.sortOrder }
          : {}),
        ...(parsed.data.isActive !== undefined
          ? { isActive: parsed.data.isActive }
          : {}),
      },
      include: { _count: { select: { products: true } } },
    })

    revalidateTag('categories')

    return NextResponse.json({ category: mapCategoryRow(updated) })
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

    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { id } = await params

    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    if (existing._count.products > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete category while products are assigned. Archive it or move products first.',
        },
        { status: 409 }
      )
    }

    await prisma.category.delete({ where: { id } })

    if (isCloudinaryConfigured() && existing.image) {
      const publicId = extractCloudinaryPublicId(existing.image)
      if (publicId) {
        const [productsUsingImage, categoriesUsingImage] = await Promise.all([
          prisma.product.count({ where: { images: { has: existing.image } } }),
          prisma.category.count({ where: { image: existing.image } }),
        ])

        if (productsUsingImage === 0 && categoriesUsingImage === 0) {
          try {
            await deleteFromCloudinary(publicId)
          } catch (cloudinaryError) {
            console.error(
              `Failed to delete Cloudinary image for category ${id}:`,
              cloudinaryError
            )
          }
        }
      }
    }

    revalidateTag('categories')
    revalidateTag('products')

    return NextResponse.json({
      success: true,
      message: `Category ${id} deleted successfully`,
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
