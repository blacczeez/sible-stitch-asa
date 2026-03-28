import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = mockProducts.find((p) => p.slug === slug)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Find related products from the same category, excluding the current product
    const relatedProducts = mockProducts
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.status === 'published')
      .slice(0, 4)

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
