'use client'

import { useEffect } from 'react'
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { Order } from '@/types'
import Link from 'next/link'

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'Processing', color: 'bg-indigo-100 text-indigo-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  canceled: { label: 'Canceled', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
}

const timelineSteps = [
  { key: 'paid', icon: CheckCircle, label: 'Order Confirmed' },
  { key: 'processing', icon: Package, label: 'Processing' },
  { key: 'shipped', icon: Truck, label: 'Shipped' },
  { key: 'delivered', icon: MapPin, label: 'Delivered' },
]

const statusOrder = ['pending', 'paid', 'processing', 'shipped', 'delivered']

interface OrderDetailContentProps {
  order: Order
  isSuccess: boolean
}

export function OrderDetailContent({ order, isSuccess }: OrderDetailContentProps) {
  const clearCart = useCartStore((s) => s.clearCart)

  // Clear cart when arriving from a successful checkout.
  // This runs on the order page (not checkout page) to avoid a race condition
  // where clearing the cart on checkout triggers the empty-cart guard redirect.
  useEffect(() => {
    if (isSuccess) {
      clearCart()
    }
  }, [isSuccess, clearCart])

  const currentStepIndex = statusOrder.indexOf(order.status)
  const statusInfo = statusConfig[order.status] || statusConfig.pending

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h1 className="text-2xl font-serif font-bold text-green-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-green-700">
            Thank you for your purchase. A confirmation email will be sent to{' '}
            <strong>{order.email}</strong>
          </p>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Order {order.orderNumber}</CardTitle>
            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-8">
            {timelineSteps.map((step, idx) => {
              const stepIdx = statusOrder.indexOf(step.key)
              const isCompleted = currentStepIndex >= stepIdx
              const Icon = step.icon
              return (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {idx > 0 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {idx < timelineSteps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          currentStepIndex > stepIdx ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center">{step.label}</span>
                </div>
              )
            })}
          </div>

          {order.trackingNumber && (
            <div className="bg-muted rounded-md p-3 mb-6 text-sm">
              <strong>Tracking:</strong> {order.trackingCarrier} -{' '}
              {order.trackingNumber}
            </div>
          )}

          <Separator className="my-4" />

          <h3 className="font-semibold mb-3">Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-muted-foreground">
                    {item.variantName} &times; {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
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
              <span>
                {order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <div className="text-sm text-muted-foreground">
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button asChild variant="outline">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
