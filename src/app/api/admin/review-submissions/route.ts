import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { listReviewSubmissions } from '@/lib/data/customer-stories'

export async function GET() {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const submissions = await listReviewSubmissions()
    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Error fetching review submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review submissions' },
      { status: 500 }
    )
  }
}
