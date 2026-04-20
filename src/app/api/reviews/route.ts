import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { listReviewsForProduct, createGuestProductReview } from '@/lib/data/reviews'

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(2000),
  productId: z.string().uuid(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      )
    }

    const reviews = await listReviewsForProduct(productId)
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null

    return NextResponse.json({
      reviews,
      total: reviews.length,
      averageRating,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = createReviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid review data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const review = await createGuestProductReview(parsed.data)

    revalidateTag(`reviews-${parsed.data.productId}`)
    revalidateTag('products')

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    const message = error instanceof Error ? error.message : 'Failed to create review'
    const status = message.includes('not found') ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
