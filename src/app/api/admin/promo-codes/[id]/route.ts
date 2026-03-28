import { NextRequest, NextResponse } from 'next/server'
import { promoCodeSchema } from '@/validations/admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Allow partial updates
    const partialSchema = promoCodeSchema.partial()
    const parsed = partialSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid promo code data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // In production, this would update the promo code in the database via Prisma
    const updatedPromoCode = {
      id,
      code: parsed.data.code || 'EXISTING',
      type: parsed.data.type || 'percent',
      value: parsed.data.value || 0,
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ promoCode: updatedPromoCode })
  } catch (error) {
    console.error('Error updating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to update promo code' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // In production, this would delete the promo code from the database via Prisma
    return NextResponse.json({
      success: true,
      message: `Promo code ${id} deleted successfully`,
    })
  } catch (error) {
    console.error('Error deleting promo code:', error)
    return NextResponse.json(
      { error: 'Failed to delete promo code' },
      { status: 500 }
    )
  }
}
