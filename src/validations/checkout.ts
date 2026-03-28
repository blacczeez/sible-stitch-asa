import { z } from 'zod'

export const shippingAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  line1: z.string().min(1, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
})

export type ShippingAddress = z.infer<typeof shippingAddressSchema>

export const checkoutSessionSchema = z.object({
  shipping: shippingAddressSchema,
  currency: z.enum(['USD', 'GBP', 'EUR', 'CAD']).default('USD'),
})

export type CheckoutSession = z.infer<typeof checkoutSessionSchema>
