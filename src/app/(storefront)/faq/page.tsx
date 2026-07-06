import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqAccordion } from '@/components/faq/faq-accordion'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about shipping, returns, sizing, and payments at Sible Couture.',
}

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-2">
        Frequently Asked Questions
      </h1>
      <p className="text-muted-foreground mb-8">
        Find answers to common questions about orders, shipping, returns, and more.
      </p>

      <FaqAccordion />

      <div className="mt-12 rounded-lg bg-muted p-6">
        <h2 className="font-serif font-semibold text-lg mb-2">Still have questions?</h2>
        <p className="text-sm text-muted-foreground">
          We are happy to help.{' '}
          <Link href="/contact" className="text-asa-wine hover:underline">
            Contact us
          </Link>{' '}
          or email{' '}
          <a href={`mailto:${BRAND.email}`} className="text-asa-wine hover:underline">
            {BRAND.email}
          </a>
          .
        </p>
      </div>
    </div>
  )
}
