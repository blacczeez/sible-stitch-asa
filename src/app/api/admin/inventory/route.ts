import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'
import { inventoryUpdateSchema } from '@/validations/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') // 'low-stock' | 'out-of-stock' | null
    const search = searchParams.get('search')

    // Build inventory view from product variants
    let inventoryItems = mockProducts.flatMap((product) =>
      product.variants.map((variant) => ({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantId: variant.id,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        price: variant.price || product.price,
        status: variant.stock === 0 ? 'out-of-stock' : variant.stock <= 5 ? 'low-stock' : 'in-stock',
      }))
    )

    // Filter by stock status
    if (filter === 'low-stock') {
      inventoryItems = inventoryItems.filter((item) => item.stock > 0 && item.stock <= 5)
    } else if (filter === 'out-of-stock') {
      inventoryItems = inventoryItems.filter((item) => item.stock === 0)
    }

    // Filter by search
    if (search) {
      const term = search.toLowerCase()
      inventoryItems = inventoryItems.filter(
        (item) =>
          item.productName.toLowerCase().includes(term) ||
          item.sku.toLowerCase().includes(term)
      )
    }

    const summary = {
      totalVariants: inventoryItems.length,
      inStock: inventoryItems.filter((i) => i.status === 'in-stock').length,
      lowStock: inventoryItems.filter((i) => i.status === 'low-stock').length,
      outOfStock: inventoryItems.filter((i) => i.status === 'out-of-stock').length,
    }

    return NextResponse.json({
      inventory: inventoryItems,
      summary,
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
  try {
    const body = await request.json()

    const parsed = inventoryUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid inventory update data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { variantId, action, quantity } = parsed.data

    // In production, this would update the variant stock in the database via Prisma
    // action: 'set' -> set stock to quantity
    // action: 'add' -> add quantity to current stock
    // action: 'remove' -> subtract quantity from current stock

    return NextResponse.json({
      success: true,
      message: `Inventory updated: ${action} ${quantity} for variant ${variantId}`,
      variantId,
      action,
      quantity,
    })
  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
