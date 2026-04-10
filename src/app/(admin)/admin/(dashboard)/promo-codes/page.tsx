'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  adminGlassDataPanel,
  adminPageTitleClass,
  adminPrimaryButtonClass,
} from '@/lib/admin-ui'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

type PromoRow = {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  minOrderAmount: number | null
  maxUses: number | null
  usedCount: number
  isActive: boolean
  validUntil: string | null
}

export default function AdminPromoCodesPage() {
  const [open, setOpen] = useState(false)
  const [promos, setPromos] = useState<PromoRow[]>([])
  const [loading, setLoading] = useState(true)

  const [code, setCode] = useState('')
  const [type, setType] = useState<'percent' | 'fixed'>('percent')
  const [value, setValue] = useState('')
  const [minOrder, setMinOrder] = useState('')
  const [maxUses, setMaxUses] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/promo-codes', { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        setPromos(data.promoCodes ?? [])
      }
    } catch {
      setPromos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(value)
    if (Number.isNaN(val) || val <= 0) {
      toast.error('Invalid value')
      return
    }
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          type,
          value: val,
          minOrderAmount: minOrder ? parseFloat(minOrder) : undefined,
          maxUses: maxUses ? parseInt(maxUses, 10) : undefined,
          isActive: true,
        }),
      })
      if (!res.ok) throw new Error('Create failed')
      toast.success('Promo code created')
      setOpen(false)
      setCode('')
      setValue('')
      setMinOrder('')
      setMaxUses('')
      await load()
    } catch {
      toast.error('Could not create promo code')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={adminPageTitleClass}>Promo Codes</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={adminPageTitleClass}>Promo Codes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className={cn(adminPrimaryButtonClass)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Promo Code</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Code</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. SUMMER20"
                  className="mt-1 uppercase"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as 'percent' | 'fixed')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Value</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="15"
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Minimum Order Amount</Label>
                <Input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Max Uses (optional)</Label>
                <Input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Unlimited"
                  className="mt-1"
                />
              </div>
              <Button type="submit" className={cn('w-full', adminPrimaryButtonClass)}>
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className={adminGlassDataPanel}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promos.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell className="font-mono font-semibold text-sm">
                  {promo.code}
                </TableCell>
                <TableCell className="text-sm capitalize">{promo.type}</TableCell>
                <TableCell className="text-sm">
                  {promo.type === 'percent' ? `${promo.value}%` : formatCurrency(promo.value)}
                </TableCell>
                <TableCell className="text-sm">
                  {promo.minOrderAmount != null
                    ? formatCurrency(promo.minOrderAmount)
                    : '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {promo.usedCount}
                  {promo.maxUses != null ? `/${promo.maxUses}` : ''}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      promo.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {promo.validUntil
                    ? new Date(promo.validUntil).toLocaleDateString()
                    : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
