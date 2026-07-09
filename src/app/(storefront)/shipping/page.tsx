import type { Metadata } from 'next'
import Link from 'next/link'
import { Truck, RotateCcw } from 'lucide-react'
import { RETURN_SECTIONS, SHIPPING_SECTIONS } from '@/lib/policies'
import { BRAND, FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: `Shipping rates, delivery times, and return policy for ${BRAND.name}. Free shipping on orders over $${FREE_SHIPPING_THRESHOLD}.`,
}

function PolicySection({
  title,
  content,
}: {
  title: string
  content: string
}) {
  return (
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
    </div>
  )
}

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-2">
        Shipping & Returns
      </h1>
      <p className="text-muted-foreground mb-8">
        Everything you need to know about delivery and our hassle-free return policy.
      </p>

      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="w-5 h-5 text-asa-gold" />
          <h2 className="text-2xl font-serif font-bold">Shipping</h2>
        </div>
        <div className="space-y-6">
          {SHIPPING_SECTIONS.map((section) => (
            <PolicySection key={section.title} {...section} />
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <RotateCcw className="w-5 h-5 text-asa-gold" />
          <h2 className="text-2xl font-serif font-bold">Returns & Exchanges</h2>
        </div>
        <div className="space-y-6">
          {RETURN_SECTIONS.map((section) => (
            <PolicySection key={section.title} {...section} />
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-muted p-6">
        <h2 className="font-serif font-semibold text-lg mb-2">Need help with an order?</h2>
        <p className="text-sm text-muted-foreground">
          Visit our{' '}
          <Link href="/faq" className="text-asa-wine hover:underline">
            FAQ
          </Link>{' '}
          or{' '}
          <Link href="/contact" className="text-asa-wine hover:underline">
            contact us
          </Link>{' '}
          at{' '}
          <a href={`mailto:${BRAND.email}`} className="text-asa-wine hover:underline">
            {BRAND.email}
          </a>
          .
        </p>
      </div>
    </div>
  )
}
