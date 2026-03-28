'use client'

import { useState } from 'react'
import { Search, AlertTriangle, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
import { mockProducts, mockDashboardStats } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminInventoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)

  const allVariants = mockProducts.flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      productName: p.name,
      productId: p.id,
    }))
  )

  const filtered = allVariants.filter((v) => {
    const matchesSearch = v.productName.toLowerCase().includes(search.toLowerCase()) || v.sku.toLowerCase().includes(search.toLowerCase())
    if (filter === 'low') return matchesSearch && v.stock > 0 && v.stock <= 5
    if (filter === 'out') return matchesSearch && v.stock === 0
    return matchesSearch
  })

  const stockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-50'
    if (stock <= 5) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Variants"
          value={allVariants.length.toString()}
          icon={Package}
        />
        <StatsCard
          title="Low Stock"
          value={mockDashboardStats.inventory.lowStock.toString()}
          icon={AlertTriangle}
        />
        <StatsCard
          title="Out of Stock"
          value={mockDashboardStats.inventory.outOfStock.toString()}
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

      <div className="border rounded-lg overflow-hidden bg-white">
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
              <TableRow key={variant.id}>
                <TableCell className="font-medium text-sm">
                  {variant.productName}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {variant.sku}
                </TableCell>
                <TableCell className="text-sm">{variant.size}</TableCell>
                <TableCell className="text-sm">{variant.color}</TableCell>
                <TableCell>
                  <Badge className={cn('font-mono', stockColor(variant.stock))}>
                    {variant.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Adjust
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adjust Stock</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm">
                          <strong>{variant.productName}</strong> - {variant.size} / {variant.color}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Current stock: {variant.stock}
                        </p>
                        <div>
                          <Label>Action</Label>
                          <Select defaultValue="set">
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
                          <Input type="number" min="0" defaultValue="0" className="mt-1" />
                        </div>
                        <Button
                          className="w-full bg-asa-charcoal"
                          onClick={() => {
                            toast.success('Stock updated (mock)')
                            setAdjustDialogOpen(false)
                          }}
                        >
                          Update Stock
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
