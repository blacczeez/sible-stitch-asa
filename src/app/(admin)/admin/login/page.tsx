'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') || '')
    const password = String(form.get('password') || '')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    if (supabaseUrl.includes('placeholder')) {
      setTimeout(() => {
        router.push(redirect)
        setLoading(false)
      }, 300)
      return
    }

    try {
      const supabase = createClient()
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signError) {
        setError(signError.message)
        setLoading(false)
        return
      }
      router.push(redirect)
      router.refresh()
    } catch {
      setError('Sign in failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-asa-cream p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-3xl font-serif font-bold text-asa-gold mb-2">
            ÀṢÀ
          </div>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue="admin@asa-fashion.com"
                className="mt-1"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                defaultValue="admin123"
                className="mt-1"
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-asa-charcoal"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              With placeholder Supabase credentials, dev mode redirects without
              signing in. Configure real Supabase + an admin user in the database
              for production.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
