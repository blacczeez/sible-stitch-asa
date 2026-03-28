import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const validatePromoSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = validatePromoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { code, subtotal } = parsed.data
    const normalizedCode = code.toUpperCase().trim()

    // Mock promo code validation
    if (normalizedCode === 'WELCOME15' && subtotal >= 100) {
      const discount = Math.round(subtotal * 0.15 * 100) / 100
      return NextResponse.json({
        valid: true,
        discount,
        type: 'percent',
        value: 15,
      })
    }

    return NextResponse.json({
      valid: false,
      message: 'Invalid promo code',
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    )
  }
}
