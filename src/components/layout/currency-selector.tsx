'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useCurrency, SUPPORTED_CURRENCIES } from '@/hooks/use-currency'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Currency } from '@/lib/constants'

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs font-medium">
          {CURRENCY_SYMBOLS[currency]} {currency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_CURRENCIES.map((cur) => (
          <DropdownMenuItem
            key={cur}
            onClick={() => setCurrency(cur as Currency)}
            className={cur === currency ? 'bg-secondary' : ''}
          >
            {CURRENCY_SYMBOLS[cur as Currency]} {cur}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
