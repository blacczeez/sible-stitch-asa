import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import {
  cleanupCustomerStoryMediaIfOrphaned,
  deleteCustomerStory,
  getCustomerStoryById,
  updateCustomerStory,
} from '@/lib/data/customer-stories'
import { customerStorySchema } from '@/validations/admin'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { id } = await context.params
    const story = await getCustomerStoryById(id)
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }
    return NextResponse.json({ story })
  } catch (error) {
    console.error('Error fetching customer story:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer story' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { id } = await context.params
    const body = await request.json()
    const parsed = customerStorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid story data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const existing = await getCustomerStoryById(id)
    if (!existing) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    const story = await updateCustomerStory(id, parsed.data)

    if (
      existing.mediaUrl !== parsed.data.mediaUrl ||
      existing.mediaType !== parsed.data.mediaType
    ) {
      await cleanupCustomerStoryMediaIfOrphaned(
        existing.mediaUrl,
        existing.mediaType
      )
    }

    revalidateTag('customer-stories')

    return NextResponse.json({ story })
  } catch (error) {
    console.error('Error updating customer story:', error)
    return NextResponse.json(
      { error: 'Failed to update customer story' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { id } = await context.params
    const existing = await getCustomerStoryById(id)
    if (!existing) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    const { mediaUrl, mediaType } = existing
    await deleteCustomerStory(id)
    await cleanupCustomerStoryMediaIfOrphaned(mediaUrl, mediaType)

    revalidateTag('customer-stories')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting customer story:', error)
    return NextResponse.json(
      { error: 'Failed to delete customer story' },
      { status: 500 }
    )
  }
}
