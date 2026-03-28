'use client'

import { useState } from 'react'
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
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const mockPromoCodes = [
  {
    id: 'promo-1',
    code: 'WELCOME15',
    type: 'percent' as const,
    value: 15,
    minOrderAmount: 100,
    maxUses: null,
    usesCount: 142,
    isActive: true,
    validUntil: '2027-12-31',
  },
  {
    id: 'promo-2',
    code: 'SUMMER20',
    type: 'percent' as const,
    value: 20,
    minOrderAmount: 200,
    maxUses: 500,
    usesCount: 89,
    isActive: true,
    validUntil: '2026-09-30',
  },
  {
    id: 'promo-3',
    code: 'FLAT50',
    type: 'fixed' as const,
    value: 50,
    minOrderAmount: 250,
    maxUses: 100,
    usesCount: 100,
    isActive: false,
    validUntil: '2026-06-30',
  },
]

export default function AdminPromoCodesPage() {
  const [open, setOpen] = useState(false)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Promo code created (mock)')
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-asa-charcoal">
              <Plus className="w-4 h-4 mr-2" />
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
                <Input placeholder="e.g. SUMMER20" className="mt-1 uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select defaultValue="percent">
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
                  <Input type="number" placeholder="15" className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Minimum Order Amount</Label>
                <Input type="number" placeholder="100" className="mt-1" />
              </div>
              <div>
                <Label>Max Uses (optional)</Label>
                <Input type="number" placeholder="Unlimited" className="mt-1" />
              </div>
              <Button type="submit" className="w-full bg-asa-charcoal">
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
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
            {mockPromoCodes.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell className="font-mono font-semibold text-sm">
                  {promo.code}
                </TableCell>
                <TableCell className="text-sm capitalize">{promo.type}</TableCell>
                <TableCell className="text-sm">
                  {promo.type === 'percent' ? `${promo.value}%` : formatCurrency(promo.value)}
                </TableCell>
                <TableCell className="text-sm">
                  {promo.minOrderAmount ? formatCurrency(promo.minOrderAmount) : '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {promo.usesCount}{promo.maxUses ? `/${promo.maxUses}` : ''}
                </TableCell>
                <TableCell>
                  <Badge className={promo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {promo.validUntil}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
