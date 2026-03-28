import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'
import { updateProductSchema } from '@/validations/product'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = mockProducts.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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

    const product = mockProducts.find((p) => p.id === id)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const parsed = updateProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid product data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // In production, this would update the product in the database via Prisma
    const updatedProduct = {
      ...product,
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
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

    const product = mockProducts.find((p) => p.id === id)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // In production, this would delete (or soft-delete) the product via Prisma
    return NextResponse.json({
      success: true,
      message: `Product ${id} deleted successfully`,
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
