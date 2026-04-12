'use client'

import { useState } from 'react'

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
    <section className="bg-asa-charcoal text-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-3">
          Join the{' '}
          <em className="italic text-asa-gold">Sible Couture</em>{' '}
          Community
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Subscribe for exclusive offers, new arrivals, and styling inspiration
          delivered to your inbox.
        </p>
        {submitted ? (
          <p className="text-asa-gold font-serif font-medium text-lg italic">
            Thank you for subscribing! Welcome to the Sible Couture family.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
          >
            <div className="flex rounded-full overflow-hidden border border-white/20 focus-within:border-asa-gold transition-colors">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-3 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none min-w-0"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-asa-gold text-asa-charcoal font-semibold text-sm hover:bg-asa-gold/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
