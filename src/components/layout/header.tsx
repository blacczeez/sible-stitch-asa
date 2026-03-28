'use client'

import Link from 'next/link'
import { ShoppingBag, Heart, Search, Menu } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useUIStore } from '@/store/ui-store'
import { AnnouncementBar } from './announcement-bar'
import { MobileNav } from './mobile-nav'
import { CartDrawer } from './cart-drawer'
import { SearchDialog } from './search-dialog'
import { CurrencySelector } from './currency-selector'
import { NAV_LINKS } from '@/lib/constants'

export function Header() {
  const { itemCount } = useCart()
  const { setMobileMenuOpen, setSearchOpen, setCartDrawerOpen } = useUIStore()

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <AnnouncementBar />
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link
                href="/"
                className="text-2xl md:text-3xl font-serif font-bold text-asa-gold"
              >
                ÀṢÀ
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-asa-charcoal hover:text-asa-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <CurrencySelector />
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-secondary rounded-md transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/wishlist"
                className="p-2 hover:bg-secondary rounded-md transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 hover:bg-secondary rounded-md transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-asa-terracotta text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav />
      <CartDrawer />
      <SearchDialog />
    </>
  )
}
