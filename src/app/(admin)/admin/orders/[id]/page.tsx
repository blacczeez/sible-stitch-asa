'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockOrders } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'canceled']
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
}

export default function AdminOrderDetailPage() {
  const router = useRouter()
  const order = mockOrders[0]

  const handleStatusUpdate = () => {
    toast.success('Order status updated (mock)')
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge className={statusColors[order.status]}>{order.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.variantName} &times; {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Update */}
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select defaultValue={order.status}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tracking Number</Label>
              <Input defaultValue={order.trackingNumber || ''} className="mt-1" />
            </div>
            <div>
              <Label>Carrier</Label>
              <Input defaultValue={order.trackingCarrier || ''} className="mt-1" />
            </div>
            <Button onClick={handleStatusUpdate} className="w-full bg-asa-charcoal">
              Update Order
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.back()}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
