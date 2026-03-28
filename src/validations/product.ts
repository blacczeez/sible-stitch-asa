import { z } from 'zod'

export const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc', 'popular']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
})

export type ProductQuery = z.infer<typeof productQuerySchema>

const variantSchema = z.object({
  size: z.string().min(1),
  color: z.string().min(1),
  sku: z.string().min(1),
  stock: z.number().int().min(0),
  price: z.number().positive().optional(),
})

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  categoryId: z.string().uuid(),
  images: z.array(z.string().url()).min(1),
  isFeatured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  variants: z.array(variantSchema).min(1),
})

export type CreateProduct = z.input<typeof createProductSchema>

export const updateProductSchema = createProductSchema.partial()

export type UpdateProduct = z.infer<typeof updateProductSchema>
