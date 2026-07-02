import { headers } from 'next/headers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StorefrontMain } from '@/components/layout/storefront-main'

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <Header isHome={isHome} />
      <StorefrontMain>{children}</StorefrontMain>
      <Footer />
    </div>
  )
}
