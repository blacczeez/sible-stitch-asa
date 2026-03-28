'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'

const CATEGORIES = [
  { slug: 'ankara-prints', label: 'Ankara Prints' },
  { slug: 'casual-wear', label: 'Casual Wear' },
  { slug: 'accessories', label: 'Accessories' },
]

const PRICE_RANGES = [
  { value: '0-100', label: 'Under $100' },
  { value: '100-200', label: '$100 - $200' },
  { value: '200-300', label: '$200 - $300' },
  { value: '300+', label: '$300+' },
]

const SIZES = ['S', 'M', 'L', 'XL', 'One Size']

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeCategories = searchParams.getAll('category')
  const activePriceRange = searchParams.get('price')
  const activeSizes = searchParams.getAll('size')

  const createQueryString = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key)

        if (value === null) return

        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v))
        } else {
          params.set(key, value)
        }
      })

      return params.toString()
    },
    [searchParams]
  )

  function toggleCategory(slug: string) {
    const current = [...activeCategories]
    const index = current.indexOf(slug)

    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(slug)
    }

    const qs = createQueryString({
      category: current.length > 0 ? current : null,
    })
    router.push(`?${qs}`, { scroll: false })
  }

  function setPriceRange(value: string) {
    const qs = createQueryString({
      price: activePriceRange === value ? null : value,
    })
    router.push(`?${qs}`, { scroll: false })
  }

  function toggleSize(size: string) {
    const current = [...activeSizes]
    const index = current.indexOf(size)

    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(size)
    }

    const qs = createQueryString({
      size: current.length > 0 ? current : null,
    })
    router.push(`?${qs}`, { scroll: false })
  }

  function clearAll() {
    router.push('?', { scroll: false })
  }

  const hasFilters =
    activeCategories.length > 0 || activePriceRange || activeSizes.length > 0

  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-asa-charcoal">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-asa-wine hover:text-asa-wine/80"
          >
            <X className="size-3.5" />
            Clear All
          </Button>
        )}
      </div>

      <Separator />

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-asa-charcoal">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.slug} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={activeCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <Label
                htmlFor={`cat-${cat.slug}`}
                className="text-sm font-normal cursor-pointer"
              >
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-asa-charcoal">Price Range</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <div key={range.value} className="flex items-center gap-2">
              <Checkbox
                id={`price-${range.value}`}
                checked={activePriceRange === range.value}
                onCheckedChange={() => setPriceRange(range.value)}
              />
              <Label
                htmlFor={`price-${range.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Size Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-asa-charcoal">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <Button
              key={size}
              variant="outline"
              size="sm"
              onClick={() => toggleSize(size)}
              className={cn(
                'min-w-[3rem] text-xs',
                activeSizes.includes(size) &&
                  'border-asa-wine bg-asa-wine text-white hover:bg-asa-wine/90 hover:text-white'
              )}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}
