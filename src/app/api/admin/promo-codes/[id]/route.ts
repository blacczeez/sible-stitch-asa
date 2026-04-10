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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { id } = await params
    const body = await request.json()

    const partialSchema = promoCodeSchema.partial()
    const parsed = partialSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid promo code data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    const existing = await prisma.promoCode.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 })
    }

    const updated = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(data.code !== undefined ? { code: data.code } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.value !== undefined
          ? { value: new Prisma.Decimal(data.value) }
          : {}),
        ...(data.minOrderAmount !== undefined
          ? {
              minOrderAmount:
                data.minOrderAmount != null
                  ? new Prisma.Decimal(data.minOrderAmount)
                  : null,
            }
          : {}),
        ...(data.maxUses !== undefined ? { maxUses: data.maxUses } : {}),
        ...(data.validFrom !== undefined
          ? { validFrom: new Date(data.validFrom) }
          : {}),
        ...(data.validUntil !== undefined
          ? {
              validUntil: data.validUntil
                ? new Date(data.validUntil)
                : null,
            }
          : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    })

    return NextResponse.json({ promoCode: mapPromo(updated) })
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
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { id } = await params

    const existing = await prisma.promoCode.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 })
    }

    await prisma.promoCode.delete({ where: { id } })

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
