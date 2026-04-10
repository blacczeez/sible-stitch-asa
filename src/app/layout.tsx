import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import { Providers } from '@/components/providers'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: {
    default: 'ÀṢÀ - Premium African Fashion',
    template: '%s | ÀṢÀ',
  },
  description:
    'Discover premium African-inspired fashion. Shop Ankara prints, casual wear, and accessories for the modern global citizen.',
  keywords: [
    'African fashion',
    'Ankara prints',
    'African clothing',
    'premium fashion',
    'African diaspora',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        <AnalyticsProvider />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
