import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // In development with placeholder credentials, allow access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl?.includes('placeholder')) {
      return NextResponse.next()
    }

    // In production, check for auth cookie
    const hasAuth = request.cookies.has('sb-access-token') ||
      request.cookies.getAll().some((c) => c.name.includes('auth-token'))

    if (!hasAuth) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
