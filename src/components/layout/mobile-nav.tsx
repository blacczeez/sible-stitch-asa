'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useUIStore } from '@/store/ui-store'
import { NAV_LINKS } from '@/lib/constants'
import { CurrencySelector } from './currency-selector'

export function MobileNav() {
  const { mobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useUIStore()

  function openSearchFromMenu() {
    setMobileMenuOpen(false)
    setSearchOpen(true)
  }

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="w-80 bg-asa-cream flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <Image
              src="/images/sible-logo.webp"
              alt="Sible Couture"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-3 px-4">
          <button
            type="button"
            onClick={openSearchFromMenu}
            className="flex w-full items-center gap-3 rounded-lg border border-asa-charcoal/15 bg-white/70 px-4 py-3 text-left text-asa-charcoal transition-colors hover:border-asa-gold/40 hover:bg-white"
          >
            <Search className="size-5 shrink-0 text-asa-charcoal" aria-hidden />
            <span className="font-serif text-base font-medium tracking-wide">
              Search
            </span>
          </button>
          <div className="rounded-lg border border-asa-charcoal/15 bg-white/70 px-4 py-2">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Currency
            </p>
            <div className="flex justify-start [&_button]:h-10 [&_button]:w-full [&_button]:justify-start [&_button]:px-0">
              <CurrencySelector />
            </div>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3.5 text-lg font-serif font-medium tracking-wide text-asa-charcoal hover:text-asa-gold hover:bg-white/60 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-10 px-4">
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            Premium African Fashion
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
