'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

/**
 * Offsets page content below the fixed announcement + header.
 * Home (/) uses a full-bleed hero under the transparent header — no offset.
 */
export function StorefrontMain({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <main
      className={cn(
        'flex-1',
        !isHome &&
          'pt-(--storefront-header-offset) md:pt-(--storefront-header-offset-md)',
        className
      )}
    >
      {children}
    </main>
  )
}
