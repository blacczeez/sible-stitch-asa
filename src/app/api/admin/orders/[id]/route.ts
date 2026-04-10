import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { mapOrder } from '@/lib/data/mappers'
import { orderUpdateSchema } from '@/validations/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: { shippingAddress: true, items: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order: mapOrder(order) })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
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

    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const parsed = orderUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid order update data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    const shippedAt =
      data.status === 'shipped' && !existing.shippedAt
        ? new Date()
        : existing.shippedAt

    const deliveredAt =
      data.status === 'delivered' && !existing.deliveredAt
        ? new Date()
        : existing.deliveredAt

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        trackingNumber: data.trackingNumber ?? existing.trackingNumber,
        trackingCarrier: data.trackingCarrier ?? existing.trackingCarrier,
        notes: data.notes ?? existing.notes,
        shippedAt,
        deliveredAt,
      },
      include: { shippingAddress: true, items: true },
    })

    return NextResponse.json({ order: mapOrder(updated) })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
