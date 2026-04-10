import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug, getRelatedProducts } from '@/lib/data/products'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await getProductBySlug(slug)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const relatedProducts = await getRelatedProducts(
      product.categoryId,
      product.id,
      4
    )

    return NextResponse.json({
      product,
      relatedProducts,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
