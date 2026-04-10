'use client'

import { useState, useEffect } from 'react'
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
        <header
          className={`transition-all duration-300 ${
            scrolled
              ? 'bg-white/95 backdrop-blur-md shadow-sm'
              : 'bg-transparent'
          }`}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left: hamburger (mobile) + nav links (desktop) */}
              <div className="flex items-center gap-6 flex-1">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu
                    className={`w-6 h-6 transition-colors ${
                      scrolled ? 'text-asa-charcoal' : 'text-white'
                    }`}
                  />
                </button>
                <nav className="hidden lg:flex items-center gap-6">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-[11px] font-medium tracking-[0.15em] uppercase transition-colors ${
                        scrolled
                          ? 'text-asa-charcoal hover:text-asa-gold'
                          : 'text-white/90 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Center: logo */}
              <Link
                href="/"
                className={`text-3xl md:text-4xl font-serif font-bold tracking-wide transition-colors ${
                  scrolled ? 'text-asa-charcoal' : 'text-white'
                }`}
              >
                ÀṢÀ
              </Link>

              {/* Right: search pill, currency, wishlist, cart */}
              <div className="flex items-center gap-2 flex-1 justify-end">
                <button
                  onClick={() => setSearchOpen(true)}
                  className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs transition-colors ${
                    scrolled
                      ? 'border-border text-muted-foreground hover:border-asa-charcoal'
                      : 'border-white/30 text-white/70 hover:border-white/60'
                  }`}
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
                <button
                  onClick={() => setSearchOpen(true)}
                  className={`sm:hidden p-2 rounded-full transition-colors ${
                    scrolled ? 'text-asa-charcoal hover:bg-secondary' : 'text-white hover:bg-white/10'
                  }`}
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <div className={scrolled ? '' : '[&_button]:text-white'}>
                  <CurrencySelector />
                </div>
                <Link
                  href="/wishlist"
                  className={`p-2 rounded-full transition-colors ${
                    scrolled
                      ? 'text-asa-charcoal hover:bg-secondary'
                      : 'text-white hover:bg-white/10'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => setCartDrawerOpen(true)}
                  className={`relative p-2 rounded-full transition-colors ${
                    scrolled
                      ? 'text-asa-charcoal hover:bg-secondary'
                      : 'text-white hover:bg-white/10'
                  }`}
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-asa-gold text-asa-charcoal text-[10px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      <MobileNav />
      <CartDrawer />
      <SearchDialog />
    </>
  )
}
