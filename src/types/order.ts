export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'canceled'
  | 'refunded'

export interface Address {
  id: string
  name: string
  phone: string | null
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderItem {
  id: string
  productName: string
  variantName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  email: string
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  currency: string
  stripePaymentId: string | null
  paidAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
  trackingNumber: string | null
  trackingCarrier: string | null
  notes: string | null
  shippingAddress: Address
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}
