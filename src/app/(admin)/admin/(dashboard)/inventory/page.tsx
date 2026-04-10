'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, AlertTriangle, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { StatsCard } from '@/components/admin/stats-card'
import { STOCK_THRESHOLDS } from '@/lib/constants'
import {
  adminGlassDataPanel,
  adminPageTitleClass,
  adminPrimaryButtonClass,
} from '@/lib/admin-ui'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type InventoryRow = {
  variantId: string
  sku: string
  productId: string
  productName: string
  size: string
  color: string
  stock: number
}

export default function AdminInventoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [rows, setRows] = useState<InventoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [selected, setSelected] = useState<InventoryRow | null>(null)
  const [action, setAction] = useState<'set' | 'add' | 'remove'>('set')
  const [qty, setQty] = useState('0')

  async function loadInventory() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/inventory', { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        setRows(data.inventoryItems ?? [])
      }
    } catch {
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadInventory()
  }, [])

  const stats = useMemo(() => {
    const low = rows.filter(
      (r) => r.stock > 0 && r.stock <= STOCK_THRESHOLDS.LOW
    ).length
    const out = rows.filter((r) => r.stock === STOCK_THRESHOLDS.OUT).length
    return { total: rows.length, low, out }
  }, [rows])

  const filtered = rows.filter((v) => {
    const matchesSearch =
      v.productName.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase())
    if (filter === 'low')
      return matchesSearch && v.stock > 0 && v.stock <= STOCK_THRESHOLDS.LOW
    if (filter === 'out') return matchesSearch && v.stock === 0
    return matchesSearch
  })

  const stockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-50'
    if (stock <= STOCK_THRESHOLDS.LOW) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  async function applyAdjustment() {
    if (!selected) return
    const quantity = parseInt(qty, 10)
    if (Number.isNaN(quantity) || quantity < 0) {
      toast.error('Invalid quantity')
      return
    }
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selected.variantId,
          action,
          quantity,
        }),
      })
      if (!res.ok) throw new Error('Update failed')
      toast.success('Stock updated')
      setAdjustOpen(false)
      await loadInventory()
    } catch {
      toast.error('Could not update stock')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={adminPageTitleClass}>Inventory</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className={adminPageTitleClass}>Inventory</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Variants"
          value={stats.total.toString()}
          icon={Package}
        />
        <StatsCard
          title="Low Stock"
          value={stats.low.toString()}
          icon={AlertTriangle}
        />
        <StatsCard
          title="Out of Stock"
          value={stats.out.toString()}
          icon={AlertTriangle}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by product or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="low">Low Stock</TabsTrigger>
            <TabsTrigger value="out">Out of Stock</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={adminGlassDataPanel}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((variant) => (
              <TableRow key={variant.variantId}>
                <TableCell className="font-medium text-sm">
                  {variant.productName}
                </TableCell>
                <TableCell className="font-mono text-xs">{variant.sku}</TableCell>
                <TableCell className="text-sm">{variant.size}</TableCell>
                <TableCell className="text-sm">{variant.color}</TableCell>
                <TableCell>
                  <Badge className={cn('font-mono', stockColor(variant.stock))}>
                    {variant.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setSelected(variant)
                      setQty(String(variant.stock))
                      setAction('set')
                      setAdjustOpen(true)
                    }}
                  >
                    Adjust
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <p className="text-sm">
                <strong>{selected.productName}</strong> — {selected.size} / {selected.color}
              </p>
              <p className="text-sm text-muted-foreground">
                Current stock: {selected.stock}
              </p>
              <div>
                <Label>Action</Label>
                <Select
                  value={action}
                  onValueChange={(v) => setAction(v as typeof action)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="set">Set to</SelectItem>
                    <SelectItem value="add">Add</SelectItem>
                    <SelectItem value="remove">Remove</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="0"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                className={cn('w-full', adminPrimaryButtonClass)}
                type="button"
                onClick={applyAdjustment}
              >
                Update Stock
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
