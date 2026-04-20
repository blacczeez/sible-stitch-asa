'use client'

import { useFilterNavigation } from '@/hooks/use-filter-navigation'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const FILTER_LABELS: Record<string, Record<string, string>> = {
  category: {
    'ankara-prints': 'Ankara Prints',
    'casual-wear': 'Casual Wear',
    accessories: 'Accessories',
  },
  price: {
    '0-100': 'Under $100',
    '100-200': '$100 - $200',
    '200-300': '$200 - $300',
    '300+': '$300+',
  },
}

function getFilterLabel(key: string, value: string): string {
  return FILTER_LABELS[key]?.[value] ?? value
}

export function ActiveFilters() {
  const { navigate, searchParams } = useFilterNavigation()

  const filters: { key: string; value: string; label: string }[] = []

  searchParams.forEach((value, key) => {
    if (key === 'sort') return

    filters.push({
      key,
      value,
      label: `${key === 'size' ? 'Size: ' : ''}${getFilterLabel(key, value)}`,
    })
  })

  if (filters.length === 0) return null

  function removeFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    const values = params.getAll(key).filter((v) => v !== value)
    params.delete(key)
    values.forEach((v) => params.append(key, v))
    navigate(`?${params.toString()}`, { scroll: false })
  }

  function clearAll() {
    const params = new URLSearchParams()
    const sort = searchParams.get('sort')
    if (sort) params.set('sort', sort)
    navigate(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Badge
          key={`${filter.key}-${filter.value}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {filter.label}
          <button
            onClick={() => removeFilter(filter.key, filter.value)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="xs"
        onClick={clearAll}
        className="text-asa-wine hover:text-asa-wine/80"
      >
        Clear All
      </Button>
    </div>
  )
}
