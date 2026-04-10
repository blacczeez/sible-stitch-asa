import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

const isPlaceholder = (val: string | undefined) =>
  !val || val.includes('placeholder')

export async function requireAdmin() {
  // Bypass auth in dev when using placeholder credentials
  if (
    process.env.NODE_ENV === 'development' &&
    isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL)
  ) {
    return {
      user: {
        id: 'dev-admin',
        email: 'admin@asa-fashion.com',
        role: 'admin' as const,
        name: 'Admin',
      },
    }
  }

  const supabase = await createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true, email: true, role: true, name: true },
  })

  if (dbUser?.role !== 'admin') {
    return {
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return { user: dbUser }
}
