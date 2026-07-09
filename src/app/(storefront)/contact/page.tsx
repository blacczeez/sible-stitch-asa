import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with the ${BRAND.name} team for order support, sizing help, and general inquiries.`,
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-2">
        Contact Us
      </h1>
      <p className="text-muted-foreground mb-8">
        We would love to hear from you. Send us a message and we will respond as soon as possible.
      </p>

      <ContactForm />
    </div>
  )
}
