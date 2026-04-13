'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Warehouse,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/promo-codes', label: 'Promo Codes', icon: Tag },
  { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-asa-charcoal text-white shadow-[4px_0_24px_-12px_rgba(26,23,20,0.2)]">
      <div className="p-6">
        <Link href="/admin">
          <Image
            src="/images/sible-logo.webp"
            alt="Sible Couture"
            width={400}
            height={34}
            className="h-7 w-auto brightness-0 invert"
          />
        </Link>
        <p className="mt-1 text-xs text-white/50">Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-asa-gold/15 font-medium text-asa-gold'
                  : 'text-white/55 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          Back to Store
        </Link>
      </div>
    </aside>
  )
}
