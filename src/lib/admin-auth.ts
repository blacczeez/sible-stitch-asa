import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export type AdminUser = {
  id: string
  email: string
  role: 'admin'
  name: string | null
}

/** Use in server components under /admin (not on /admin/login). */
export async function assertAdminAccess(): Promise<AdminUser> {
  const supabase = await createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect('/admin/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true, email: true, role: true, name: true },
  })

  if (!dbUser || dbUser.role !== 'admin') {
    redirect('/admin/login?error=forbidden')
  }

  return { id: dbUser.id, email: dbUser.email, role: 'admin', name: dbUser.name }
}

export async function requireAdmin() {
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
