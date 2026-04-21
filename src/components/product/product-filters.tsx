'use client'

import { useCallback } from 'react'
import { useFilterNavigation } from '@/hooks/use-filter-navigation'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'

const CATEGORIES = [
  { slug: 'ankara', label: 'Ankara Prints' },
  { slug: 'casual', label: 'Casual Wear' },
  { slug: 'accessories', label: 'Accessories' },
]

const PRICE_RANGES = [
  { min: '0', max: '100', label: 'Under $100' },
  { min: '100', max: '200', label: '$100 - $200' },
  { min: '200', max: '300', label: '$200 - $300' },
  { min: '300', max: '', label: '$300+' },
]

const SIZES = ['S', 'M', 'L', 'XL', 'One Size']

export function ProductFilters() {
  const { navigate, searchParams } = useFilterNavigation()

  const activeCategories = searchParams.getAll('category')
  const activeMinPrice = searchParams.get('minPrice')
  const activeMaxPrice = searchParams.get('maxPrice')
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
    navigate(`?${qs}`, { scroll: false })
  }

  function setPriceRange(min: string, max: string) {
    const isActive = activeMinPrice === min && activeMaxPrice === (max || null)
    const qs = createQueryString({
      minPrice: isActive ? null : min,
      maxPrice: isActive ? null : (max || null),
    })
    navigate(`?${qs}`, { scroll: false })
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
    navigate(`?${qs}`, { scroll: false })
  }

  function clearAll() {
    navigate('?', { scroll: false })
  }

  const hasFilters =
    activeCategories.length > 0 || activeMinPrice || activeMaxPrice || activeSizes.length > 0

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
          {PRICE_RANGES.map((range) => {
            const isActive = activeMinPrice === range.min && activeMaxPrice === (range.max || null)
            return (
              <div key={range.min + range.max} className="flex items-center gap-2">
                <Checkbox
                  id={`price-${range.min}-${range.max}`}
                  checked={isActive}
                  onCheckedChange={() => setPriceRange(range.min, range.max)}
                />
                <Label
                  htmlFor={`price-${range.min}-${range.max}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {range.label}
                </Label>
              </div>
            )
          })}
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
