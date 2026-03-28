'use client'

import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const breadcrumbMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'New Product',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/promo-codes': 'Promo Codes',
  '/admin/inventory': 'Inventory',
}

export function AdminHeader() {
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = segments.map((_, idx) => {
    const path = '/' + segments.slice(0, idx + 1).join('/')
    return {
      label: breadcrumbMap[path] || segments[idx],
      path,
    }
  })

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, idx) => (
          <span key={crumb.path} className="flex items-center gap-2">
            {idx > 0 && <span className="text-muted-foreground">/</span>}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? 'font-medium'
                  : 'text-muted-foreground'
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-asa-gold text-asa-charcoal text-xs font-bold">
              AD
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Admin Settings</DropdownMenuItem>
          <DropdownMenuItem>Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
