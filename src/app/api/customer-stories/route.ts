import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { listPublishedCustomerStories } from '@/lib/data/customer-stories'

const getCachedStories = unstable_cache(
  () => listPublishedCustomerStories(),
  ['customer-stories-published'],
  { tags: ['customer-stories'], revalidate: 60 }
)

export async function GET() {
  try {
    const stories = await getCachedStories()
    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Error fetching customer stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer stories' },
      { status: 500 }
    )
  }
}
