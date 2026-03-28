'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockCustomers = [
  { id: 'cust-1', name: 'John Doe', email: 'john@example.com', orders: 3, totalSpent: 729.25, lastOrder: '2026-03-08T09:00:00Z' },
  { id: 'cust-2', name: 'Jane Smith', email: 'jane@example.com', orders: 2, totalSpent: 440.00, lastOrder: '2026-03-10T14:30:00Z' },
  { id: 'cust-3', name: 'Mike Johnson', email: 'mike@example.com', orders: 1, totalSpent: 180.00, lastOrder: '2026-03-12T11:00:00Z' },
  { id: 'cust-4', name: 'Sarah Williams', email: 'sarah@example.com', orders: 5, totalSpent: 1250.00, lastOrder: '2026-03-15T16:45:00Z' },
  { id: 'cust-5', name: 'Chris Brown', email: 'chris@example.com', orders: 1, totalSpent: 95.00, lastOrder: '2026-03-18T08:20:00Z' },
  { id: 'cust-6', name: 'Amara Okafor', email: 'amara@example.com', orders: 4, totalSpent: 890.00, lastOrder: '2026-03-20T12:00:00Z' },
]

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('')

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground">
          {mockCustomers.length} total customers
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-asa-gold/10 text-asa-gold">
                        {customer.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {customer.email}
                </TableCell>
                <TableCell className="text-sm">{customer.orders}</TableCell>
                <TableCell className="text-sm font-medium">
                  {formatCurrency(customer.totalSpent)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(customer.lastOrder)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
