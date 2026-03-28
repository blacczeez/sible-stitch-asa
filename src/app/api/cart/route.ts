import { NextRequest, NextResponse } from 'next/server'

// Cart is managed client-side via Zustand store.
// These endpoints exist for future server-side cart persistence.

export async function GET() {
  return NextResponse.json({
    items: [],
    promoCode: null,
    discount: 0,
    message: 'Cart is managed client-side. This endpoint is a stub for future server-side cart persistence.',
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In production, this would persist the cart item to the database
    return NextResponse.json({
      success: true,
      message: 'Cart is managed client-side. Item would be added server-side in production.',
      item: body,
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}
