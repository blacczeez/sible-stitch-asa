import { z } from 'zod'

export const promoCodeSchema = z.object({
  code: z.string().min(1).max(50).toUpperCase(),
  type: z.enum(['percent', 'fixed']),
  value: z.number().positive(),
  minOrderAmount: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
})

export type PromoCodeInput = z.infer<typeof promoCodeSchema>

export const orderUpdateSchema = z.object({
  status: z.enum([
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'canceled',
    'refunded',
  ]),
  trackingNumber: z.string().optional(),
  trackingCarrier: z.string().optional(),
  notes: z.string().optional(),
})

export type OrderUpdate = z.infer<typeof orderUpdateSchema>

export const inventoryUpdateSchema = z.object({
  variantId: z.string().uuid(),
  action: z.enum(['set', 'add', 'remove']),
  quantity: z.number().int().min(0),
})

export type InventoryUpdate = z.infer<typeof inventoryUpdateSchema>
