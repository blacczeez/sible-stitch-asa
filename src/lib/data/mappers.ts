import type {
  Address as PrismaAddress,
  Category as PrismaCategory,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Product as PrismaProduct,
  ProductVariant as PrismaProductVariant,
  Review as PrismaReview,
  User as PrismaUser,
} from '@prisma/client'
import type { Address, Category, Order, OrderItem, Product, ProductVariant, Review } from '@/types'

export function decimalToNumber(value: { toNumber(): number } | null | undefined): number {
  if (value == null) return 0
  return value.toNumber()
}

export function mapCategory(c: PrismaCategory): Category {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    sortOrder: c.sortOrder,
  }
}

export function mapVariant(v: PrismaProductVariant): ProductVariant {
  return {
    id: v.id,
    size: v.size,
    color: v.color,
    sku: v.sku,
    stock: v.stock,
    price: v.price ? decimalToNumber(v.price) : null,
  }
}

export function mapProduct(
  p: PrismaProduct & {
    category: PrismaCategory
    variants: PrismaProductVariant[]
    reviews?: { rating: number }[]
  }
): Product {
  const reviewRatings = p.reviews?.map((r) => r.rating) ?? []
  const averageRating =
    reviewRatings.length > 0
      ? Math.round((reviewRatings.reduce((a, b) => a + b, 0) / reviewRatings.length) * 10) / 10
      : null

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: decimalToNumber(p.price),
    comparePrice: p.comparePrice ? decimalToNumber(p.comparePrice) : null,
    images: p.images,
    isFeatured: p.isFeatured,
    status: p.status as Product['status'],
    categoryId: p.categoryId,
    category: mapCategory(p.category),
    variants: p.variants.map(mapVariant),
    averageRating,
    reviewCount: reviewRatings.length,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }
}

export function mapReview(
  r: PrismaReview & { user: Pick<PrismaUser, 'name' | 'email'> }
): Review {
  const displayName =
    r.user.name?.trim() ||
    r.user.email.split('@')[0] ||
    'Customer'

  return {
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    isVerified: r.isVerified,
    userId: r.userId,
    userName: displayName,
    productId: r.productId,
    createdAt: r.createdAt.toISOString(),
  }
}

export function mapAddress(a: PrismaAddress): Address {
  return {
    id: a.id,
    name: a.name,
    phone: a.phone,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    postalCode: a.postalCode,
    country: a.country,
  }
}

export function mapOrderItem(i: PrismaOrderItem): OrderItem {
  return {
    id: i.id,
    productName: i.productName,
    variantName: i.variantName,
    quantity: i.quantity,
    unitPrice: decimalToNumber(i.unitPrice),
    totalPrice: decimalToNumber(i.totalPrice),
  }
}

export function mapOrder(
  o: PrismaOrder & {
    shippingAddress: PrismaAddress
    items: PrismaOrderItem[]
  }
): Order {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status as Order['status'],
    email: o.email,
    subtotal: decimalToNumber(o.subtotal),
    discount: decimalToNumber(o.discount),
    shipping: decimalToNumber(o.shipping),
    tax: decimalToNumber(o.tax),
    total: decimalToNumber(o.total),
    currency: o.currency,
    stripePaymentId: o.stripePaymentId,
    paidAt: o.paidAt ? o.paidAt.toISOString() : null,
    shippedAt: o.shippedAt ? o.shippedAt.toISOString() : null,
    deliveredAt: o.deliveredAt ? o.deliveredAt.toISOString() : null,
    trackingNumber: o.trackingNumber,
    trackingCarrier: o.trackingCarrier,
    notes: o.notes,
    shippingAddress: mapAddress(o.shippingAddress),
    items: o.items.map(mapOrderItem),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }
}
