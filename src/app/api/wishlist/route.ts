import { NextRequest, NextResponse } from 'next/server'

// Wishlist is managed client-side via localStorage.
// These endpoints exist for future server-side wishlist persistence.

export async function GET() {
  return NextResponse.json({
    items: [],
    message: 'Wishlist is managed client-side via localStorage. This endpoint is a stub for future server-side persistence.',
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Wishlist is managed client-side. Item would be added server-side in production.',
      productId,
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
      { status: 500 }
    )
  }
}
