'use client'

import { useFilterNavigation } from '@/hooks/use-filter-navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export function ProductSort() {
  const { navigate, searchParams } = useFilterNavigation()
  const currentSort = searchParams.get('sort') ?? 'newest'

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (value === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }

    navigate(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
