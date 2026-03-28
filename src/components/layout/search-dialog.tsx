'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { useUIStore } from '@/store/ui-store'

const QUICK_LINKS = [
  { label: 'Ankara Prints', href: '/products?category=ankara' },
  { label: 'Casual Wear', href: '/products?category=casual' },
  { label: 'Accessories', href: '/products?category=accessories' },
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Size Guide', href: '/size-guide' },
]

export function SearchDialog() {
  const router = useRouter()
  const { searchOpen, setSearchOpen } = useUIStore()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(!searchOpen)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [searchOpen, setSearchOpen])

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }, [query, router, setSearchOpen])

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <CommandInput
        placeholder="Search products..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch()
        }}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Links">
          {QUICK_LINKS.map((link) => (
            <CommandItem
              key={link.href}
              onSelect={() => {
                router.push(link.href)
                setSearchOpen(false)
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              {link.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
