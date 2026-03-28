'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // In dev mode, just redirect to admin
    setTimeout(() => {
      router.push('/admin')
    }, 500)
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
                type="email"
                defaultValue="admin@asa-fashion.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                defaultValue="admin123"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-asa-charcoal"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Dev mode: auth is bypassed with placeholder credentials
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
