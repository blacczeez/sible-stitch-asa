import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { validatePromoDiscount } from '@/lib/data/orders'

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
    const { discount, promoCodeId } = await validatePromoDiscount({
      code,
      subtotal,
    })

    if (!promoCodeId || discount <= 0) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid promo code',
      })
    }

    const promo = await prisma.promoCode.findUnique({
      where: { id: promoCodeId },
      select: { type: true, value: true },
    })

    return NextResponse.json({
      valid: true,
      discount,
      type: promo?.type ?? 'percent',
      value: promo?.value.toNumber() ?? 0,
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    )
  }
}
