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
import { mapProduct } from '@/lib/data/mappers'
import { getProductById } from '@/lib/data/products'
import { updateProductSchema } from '@/validations/product'

const include = {
  category: true,
  variants: true,
  reviews: { select: { rating: true } },
} satisfies Prisma.ProductInclude

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { id } = await params

    const product = await getProductById(id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
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

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const parsed = updateProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid product data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    const updated = await prisma.$transaction(async (tx) => {
      if (data.variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } })
      }

      const scalar: Prisma.ProductUpdateInput = {}
      if (data.name !== undefined) scalar.name = data.name
      if (data.slug !== undefined) scalar.slug = data.slug
      if (data.description !== undefined) scalar.description = data.description
      if (data.price !== undefined) scalar.price = new Prisma.Decimal(data.price)
      if (data.comparePrice !== undefined) {
        scalar.comparePrice =
          data.comparePrice != null
            ? new Prisma.Decimal(data.comparePrice)
            : null
      }
      if (data.images !== undefined) scalar.images = data.images
      if (data.isFeatured !== undefined) scalar.isFeatured = data.isFeatured
      if (data.status !== undefined) scalar.status = data.status
      if (data.categoryId !== undefined) {
        scalar.category = { connect: { id: data.categoryId } }
      }

      return tx.product.update({
        where: { id },
        data: {
          ...scalar,
          ...(data.variants
            ? {
                variants: {
                  create: data.variants.map((v) => ({
                    size: v.size,
                    color: v.color,
                    sku: v.sku,
                    stock: v.stock,
                    price: v.price != null ? new Prisma.Decimal(v.price) : null,
                  })),
                },
              }
            : {}),
        },
        include,
      })
    })

    revalidateTag('products')

    return NextResponse.json({
      product: mapProduct({
        ...updated,
        reviews: updated.reviews.map((r) => ({ rating: r.rating })),
      }),
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
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

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma.product.delete({ where: { id } })

    if (isCloudinaryConfigured()) {
      const uniqueUrls = [...new Set(existing.images)]
      for (const imageUrl of uniqueUrls) {
        const publicId = extractCloudinaryPublicId(imageUrl)
        if (!publicId) continue

        // Do not delete if another record still references this asset.
        const [productsUsingImage, categoriesUsingImage] = await Promise.all([
          prisma.product.count({ where: { images: { has: imageUrl } } }),
          prisma.category.count({ where: { image: imageUrl } }),
        ])

        if (productsUsingImage > 0 || categoriesUsingImage > 0) continue

        try {
          await deleteFromCloudinary(publicId)
        } catch (cloudinaryError) {
          console.error(
            `Failed to delete Cloudinary image for product ${id}:`,
            cloudinaryError
          )
        }
      }
    }

    revalidateTag('products')

    return NextResponse.json({
      success: true,
      message: `Product ${id} deleted successfully`,
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
