import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import {
  createCustomerStory,
  listAdminCustomerStories,
} from '@/lib/data/customer-stories'
import { customerStorySchema } from '@/validations/admin'

export async function GET() {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const stories = await listAdminCustomerStories()
    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Error fetching customer stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer stories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const parsed = customerStorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid story data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const story = await createCustomerStory(parsed.data)
    revalidateTag('customer-stories')

    return NextResponse.json({ story }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer story:', error)
    const message = error instanceof Error ? error.message : 'Failed to create story'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
