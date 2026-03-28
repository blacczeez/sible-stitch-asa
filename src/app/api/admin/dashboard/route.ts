import { NextResponse } from 'next/server'
import { mockDashboardStats } from '@/lib/mock-data'

export async function GET() {
  try {
    // In production, this would query the database for real-time stats
    // and verify admin authentication
    return NextResponse.json(mockDashboardStats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
