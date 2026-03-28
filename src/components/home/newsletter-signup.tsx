'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section className="bg-asa-wine text-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-serif font-bold mb-3">
          Join the ÀṢÀ Community
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Subscribe for exclusive offers, new arrivals, and styling inspiration
          delivered to your inbox.
        </p>
        {submitted ? (
          <p className="text-asa-gold font-medium">
            Thank you for subscribing! Welcome to the ÀṢÀ family.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-asa-gold"
            />
            <Button
              type="submit"
              className="bg-asa-gold text-asa-charcoal hover:bg-asa-gold/90 font-semibold whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
