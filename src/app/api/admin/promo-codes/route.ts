import { NextRequest, NextResponse } from 'next/server'
import { promoCodeSchema } from '@/validations/admin'

// Mock promo codes data
const mockPromoCodes = [
  {
    id: 'promo-1',
    code: 'WELCOME15',
    type: 'percent' as const,
    value: 15,
    minOrderAmount: 100,
    maxUses: 1000,
    usedCount: 245,
    validFrom: '2026-01-01T00:00:00Z',
    validUntil: '2026-12-31T23:59:59Z',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'promo-2',
    code: 'SUMMER20',
    type: 'percent' as const,
    value: 20,
    minOrderAmount: 150,
    maxUses: 500,
    usedCount: 89,
    validFrom: '2026-06-01T00:00:00Z',
    validUntil: '2026-08-31T23:59:59Z',
    isActive: false,
    createdAt: '2026-05-15T00:00:00Z',
    updatedAt: '2026-05-15T00:00:00Z',
  },
  {
    id: 'promo-3',
    code: 'FLAT25OFF',
    type: 'fixed' as const,
    value: 25,
    minOrderAmount: 200,
    maxUses: null,
    usedCount: 32,
    validFrom: '2026-03-01T00:00:00Z',
    validUntil: null,
    isActive: true,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    let filtered = [...mockPromoCodes]

    if (active !== null) {
      const isActive = active === 'true'
      filtered = filtered.filter((p) => p.isActive === isActive)
    }

    return NextResponse.json({
      promoCodes: filtered,
      total: filtered.length,
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
  try {
    const body = await request.json()

    const parsed = promoCodeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid promo code data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // In production, this would save to the database via Prisma
    const newPromoCode = {
      id: `promo-${Date.now()}`,
      ...parsed.data,
      usedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ promoCode: newPromoCode }, { status: 201 })
  } catch (error) {
    console.error('Error creating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to create promo code' },
      { status: 500 }
    )
  }
}
