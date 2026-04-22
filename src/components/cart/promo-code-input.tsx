'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/hooks/use-cart'
import { Check, X } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function PromoCodeInput() {
  const { promoCode, applyPromoCode, clearPromo } = useCart()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    const success = await applyPromoCode(code.trim().toUpperCase())
    if (!success) {
      setError('Invalid or expired promo code')
    }
    setLoading(false)
  }

  if (promoCode) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <Check className="w-4 h-4" />
          <span className="font-medium">{promoCode}</span> applied
        </div>
        <button
          onClick={clearPromo}
          className="text-green-700 hover:text-green-900"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <Input
          placeholder="Promo code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="text-sm"
          disabled={loading}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleApply}
          disabled={loading || !code.trim()}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Applying...
            </span>
          ) : (
            'Apply'
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}
