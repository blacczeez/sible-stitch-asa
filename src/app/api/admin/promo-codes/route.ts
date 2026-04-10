import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { promoCodeSchema } from '@/validations/admin'

function mapPromo(p: {
  id: string
  code: string
  type: string
  value: Prisma.Decimal
  minOrderAmount: Prisma.Decimal | null
  maxUses: number | null
  usesCount: number
  validFrom: Date
  validUntil: Date | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: p.id,
    code: p.code,
    type: p.type,
    value: p.value.toNumber(),
    minOrderAmount: p.minOrderAmount?.toNumber() ?? null,
    maxUses: p.maxUses,
    usedCount: p.usesCount,
    validFrom: p.validFrom.toISOString(),
    validUntil: p.validUntil?.toISOString() ?? null,
    isActive: p.isActive,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where =
      active !== null ? { isActive: active === 'true' } : {}

    const rows = await prisma.promoCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      promoCodes: rows.map(mapPromo),
      total: rows.length,
    })
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promo codes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()

    const parsed = promoCodeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid promo code data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    const created = await prisma.promoCode.create({
      data: {
        code: data.code,
        type: data.type,
        value: new Prisma.Decimal(data.value),
        minOrderAmount:
          data.minOrderAmount != null
            ? new Prisma.Decimal(data.minOrderAmount)
            : null,
        maxUses: data.maxUses ?? null,
        validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        isActive: data.isActive,
      },
    })

    return NextResponse.json({ promoCode: mapPromo(created) }, { status: 201 })
  } catch (error) {
    console.error('Error creating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to create promo code' },
      { status: 500 }
    )
  }
}
