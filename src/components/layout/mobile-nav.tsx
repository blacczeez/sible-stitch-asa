'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useUIStore } from '@/store/ui-store'
import { NAV_LINKS } from '@/lib/constants'

export function MobileNav() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore()

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="w-80 bg-asa-cream">
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
        <nav className="mt-10 flex flex-col gap-1">
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
