import { NextRequest, NextResponse } from 'next/server'
import { mockReviews } from '@/lib/mock-data'
import { z } from 'zod'

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  productId: z.string().min(1),
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

    const reviews = mockReviews.filter((r) => r.productId === productId)

    return NextResponse.json({
      reviews,
      total: reviews.length,
      averageRating:
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : null,
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

    const { rating, title, body: reviewBody, productId } = parsed.data

    // In production, this would save to the database
    const newReview = {
      id: `rev-${Date.now()}`,
      rating,
      title,
      body: reviewBody,
      isVerified: false,
      userId: 'mock-user',
      userName: 'Guest User',
      productId,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ review: newReview }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
