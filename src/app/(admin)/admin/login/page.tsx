'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'
import { resolveAdminLoginEmail } from '@/lib/admin-login'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin'
  const urlError = searchParams.get('error')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (urlError === 'forbidden') {
      setError('This account does not have admin access.')
    } else if (urlError === 'config') {
      setError(
        'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      )
    }
  }, [urlError])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const usernameOrEmail = String(form.get('username') || '')
    const password = String(form.get('password') || '')

    const resolved = resolveAdminLoginEmail(usernameOrEmail)
    if ('error' in resolved) {
      setError(resolved.error)
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: resolved.email,
        password,
      })
      if (signError) {
        setError(signError.message)
        setLoading(false)
        return
      }
      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Sign in failed.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-asa-cream p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-2 font-serif text-3xl font-bold text-asa-gold">
            ÀṢÀ
          </div>
          <CardTitle>Admin sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username or email</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="mt-1"
                required
                placeholder="e.g. admin or admin@yourdomain.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="mt-1"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-asa-charcoal"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Only accounts with the admin role in the database can access this
              area. Use your Supabase user email and password.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
