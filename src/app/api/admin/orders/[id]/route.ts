import { NextRequest, NextResponse } from 'next/server'
import { mockOrders } from '@/lib/mock-data'
import { orderUpdateSchema } from '@/validations/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const order = mockOrders.find((o) => o.id === id)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
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
  try {
    const { id } = await params
    const body = await request.json()

    const order = mockOrders.find((o) => o.id === id)
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const parsed = orderUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid order update data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // In production, this would update the order in the database via Prisma
    const updatedOrder = {
      ...order,
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
