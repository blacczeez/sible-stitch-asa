import { NextRequest, NextResponse } from 'next/server'

// Wishlist is managed client-side via localStorage.
// This endpoint exists for future server-side wishlist persistence.

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params

    return NextResponse.json({
      success: true,
      message: 'Wishlist is managed client-side. Item would be removed server-side in production.',
      productId,
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from wishlist' },
      { status: 500 }
    )
  }
}
