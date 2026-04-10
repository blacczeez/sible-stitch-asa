import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getDashboardStats } from '@/lib/data/dashboard'

export async function GET() {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const stats = await getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
