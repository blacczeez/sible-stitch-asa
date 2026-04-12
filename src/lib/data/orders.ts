import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { mapOrder } from '@/lib/data/mappers'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import type { Order } from '@/types'

const STANDARD_SHIPPING = 9.99

function money(n: number): Prisma.Decimal {
  return new Prisma.Decimal(Number(n.toFixed(2)))
}

async function generateUniqueOrderNumber(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
    const orderNumber = `SBL-${Date.now().toString(36).toUpperCase()}-${suffix}`
    const exists = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    })
    if (!exists) return orderNumber
  }
  throw new Error('Could not generate unique order number')
}

export async function getOrderById(id: string): Promise<Order | null> {
  const o = await prisma.order.findUnique({
    where: { id },
    include: {
      shippingAddress: true,
      items: true,
    },
  })
  if (!o) return null
  return mapOrder(o)
}

export type CheckoutLineInput = {
  variantId: string
  quantity: number
}

export type ResolvedLine = {
  variantId: string
  productId: string
  productName: string
  variantLabel: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export async function resolveCheckoutLines(
  lines: CheckoutLineInput[]
): Promise<ResolvedLine[]> {
  const resolved: ResolvedLine[] = []

  for (const line of lines) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: line.variantId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            status: true,
            price: true,
            comparePrice: true,
          },
        },
      },
    })

    if (!variant || variant.product.status !== 'published') {
      throw new Error(`Invalid variant: ${line.variantId}`)
    }
    if (variant.stock < line.quantity) {
      throw new Error(`Insufficient stock for ${variant.sku}`)
    }

    const base = variant.price ?? variant.product.price
    const unitPrice = base.toNumber()

    resolved.push({
      variantId: variant.id,
      productId: variant.product.id,
      productName: variant.product.name,
      variantLabel: `${variant.size} / ${variant.color}`,
      unitPrice,
      quantity: line.quantity,
      lineTotal: Math.round(unitPrice * line.quantity * 100) / 100,
    })
  }

  return resolved
}

export function calculateShipping(subtotalAfterDiscount: number): number {
  if (subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD) return 0
  return STANDARD_SHIPPING
}

export async function validatePromoDiscount(params: {
  code: string | null | undefined
  subtotal: number
}): Promise<{ discount: number; promoCodeId: string | null }> {
  const code = params.code?.trim()
  if (!code) return { discount: 0, promoCodeId: null }

  const normalized = code.toUpperCase()
  const promo = await prisma.promoCode.findUnique({
    where: { code: normalized },
  })

  if (
    !promo ||
    !promo.isActive ||
    (promo.validUntil && promo.validUntil < new Date())
  ) {
    return { discount: 0, promoCodeId: null }
  }

  if (promo.minOrderAmount && params.subtotal < promo.minOrderAmount.toNumber()) {
    return { discount: 0, promoCodeId: null }
  }

  if (promo.maxUses != null && promo.usesCount >= promo.maxUses) {
    return { discount: 0, promoCodeId: null }
  }

  let discount = 0
  if (promo.type === 'percent') {
    discount = Math.round(params.subtotal * (promo.value.toNumber() / 100) * 100) / 100
  } else {
    discount = Math.min(promo.value.toNumber(), params.subtotal)
  }

  return { discount, promoCodeId: promo.id }
}

export async function createGuestOrder(input: {
  email: string
  shipping: {
    firstName: string
    lastName: string
    email: string
    phone: string
    line1: string
    line2?: string | null
    city: string
    state: string
    postalCode: string
    country: string
  }
  currency: string
  lines: ResolvedLine[]
  discount: number
  promoCodeId: string | null
  mode: 'paid_mock' | 'pending_stripe'
  stripePaymentId?: string | null
}): Promise<Order> {
  const subtotal =
    Math.round(
      input.lines.reduce((s, l) => s + l.lineTotal, 0) * 100
    ) / 100
  const discount = Math.min(input.discount, subtotal)
  const subAfter = Math.round((subtotal - discount) * 100) / 100
  const shipping = calculateShipping(subAfter)
  const tax = 0
  const total = Math.round((subAfter + shipping + tax) * 100) / 100

  const orderNumber = await generateUniqueOrderNumber()

  const status =
    input.mode === 'paid_mock'
      ? ('paid' as const)
      : ('pending' as const)

  const paidAt = input.mode === 'paid_mock' ? new Date() : null

  const order = await prisma.$transaction(async (tx) => {
    const address = await tx.address.create({
      data: {
        name: `${input.shipping.firstName} ${input.shipping.lastName}`,
        phone: input.shipping.phone,
        line1: input.shipping.line1,
        line2: input.shipping.line2 || null,
        city: input.shipping.city,
        state: input.shipping.state,
        postalCode: input.shipping.postalCode,
        country: input.shipping.country,
        userId: null,
      },
    })

    const created = await tx.order.create({
      data: {
        orderNumber,
        status,
        email: input.email,
        subtotal: money(subtotal),
        discount: money(discount),
        shipping: money(shipping),
        tax: money(tax),
        total: money(total),
        currency: input.currency,
        stripePaymentId: input.stripePaymentId ?? null,
        paidAt,
        userId: null,
        shippingAddressId: address.id,
        items: {
          create: input.lines.map((l) => ({
            productName: l.productName,
            variantName: l.variantLabel,
            quantity: l.quantity,
            unitPrice: money(l.unitPrice),
            totalPrice: money(l.lineTotal),
            variantId: l.variantId,
          })),
        },
      },
      include: {
        shippingAddress: true,
        items: true,
      },
    })

    if (input.promoCodeId) {
      await tx.promoCode.update({
        where: { id: input.promoCodeId },
        data: { usesCount: { increment: 1 } },
      })
    }

    if (input.mode === 'paid_mock') {
      for (const line of input.lines) {
        await tx.productVariant.update({
          where: { id: line.variantId },
          data: { stock: { decrement: line.quantity } },
        })
      }
    }

    return created
  })

  return mapOrder(order)
}

export async function markOrderPaidFromStripe(params: {
  orderId: string
  stripePaymentId: string
}): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: params.orderId },
      include: { items: true },
    })
    if (!order || order.status !== 'pending') return

    await tx.order.update({
      where: { id: params.orderId },
      data: {
        status: 'paid',
        paidAt: new Date(),
        stripePaymentId: params.stripePaymentId,
      },
    })

    for (const item of order.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      })
    }
  })
}
