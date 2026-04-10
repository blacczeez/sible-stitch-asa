import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { mapProduct } from '@/lib/data/mappers'
import { inventoryUpdateSchema } from '@/validations/admin'

const include = {
  category: true,
  variants: true,
  reviews: { select: { rating: true } },
} satisfies Prisma.ProductInclude

export async function GET() {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const products = await prisma.product.findMany({
      include,
      orderBy: { createdAt: 'desc' },
    })

    const inventoryItems = products.flatMap((product) =>
      product.variants.map((v) => ({
        variantId: v.id,
        sku: v.sku,
        productId: product.id,
        productName: product.name,
        size: v.size,
        color: v.color,
        stock: v.stock,
        price: v.price?.toNumber() ?? product.price.toNumber(),
      }))
    )

    return NextResponse.json({
      inventoryItems,
      products: products.map((p) =>
        mapProduct({
          ...p,
          reviews: p.reviews.map((r) => ({ rating: r.rating })),
        })
      ),
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const parsed = inventoryUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid inventory update', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { variantId, action, quantity } = parsed.data

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    })
    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
    }

    let next = variant.stock
    if (action === 'set') next = quantity
    if (action === 'add') next = variant.stock + quantity
    if (action === 'remove') next = Math.max(0, variant.stock - quantity)

    await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: next },
    })

    return NextResponse.json({ success: true, stock: next })
  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
