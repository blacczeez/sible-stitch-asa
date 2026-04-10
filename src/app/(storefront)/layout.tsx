import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StorefrontMain } from '@/components/layout/storefront-main'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <StorefrontMain>{children}</StorefrontMain>
      <Footer />
    </div>
  )
}
