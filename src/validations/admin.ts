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

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  description: z.string().trim().max(500).nullable().optional(),
  image: z.string().trim().url().max(2000).nullable().optional(),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  isActive: z.boolean().default(true),
})

export type CategoryInput = z.infer<typeof categorySchema>
