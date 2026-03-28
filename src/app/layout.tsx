import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Providers } from '@/components/providers'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <AnalyticsProvider />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
