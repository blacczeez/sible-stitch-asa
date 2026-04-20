import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { mapProduct } from '@/lib/data/mappers'
import type { Product } from '@/types'
import type { ProductQuery } from '@/validations/product'

const productInclude = {
  category: true,
  variants: true,
  reviews: { select: { rating: true } },
} satisfies Prisma.ProductInclude

export async function listProducts(
  query: ProductQuery
): Promise<{ products: Product[]; totalItems: number }> {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    size,
    color,
    sort,
    page,
    limit,
    ids: idsParam,
  } = query

  const ids = idsParam
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const where: Prisma.ProductWhereInput = {
    status: 'published',
    ...(ids?.length
      ? { id: { in: ids } }
      : {
          ...(category ? { category: { slug: category } } : {}),
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {}),
          ...(minPrice !== undefined || maxPrice !== undefined
            ? {
                AND: [
                  ...(minPrice !== undefined
                    ? [{ price: { gte: minPrice } }]
                    : []),
                  ...(maxPrice !== undefined
                    ? [{ price: { lte: maxPrice } }]
                    : []),
                ],
              }
            : {}),
          ...(size || color
            ? {
                variants: {
                  some: {
                    ...(size
                      ? { size: { equals: size, mode: 'insensitive' } }
                      : {}),
                    ...(color
                      ? { color: { equals: color, mode: 'insensitive' } }
                      : {}),
                    stock: { gt: 0 },
                  },
                },
              }
            : {}),
        }),
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    sort === 'price-asc'
      ? [{ price: 'asc' }]
      : sort === 'price-desc'
        ? [{ price: 'desc' }]
        : sort === 'popular'
          ? [{ reviews: { _count: 'desc' } }]
          : [{ createdAt: 'desc' }]

  const isIdsMode = Boolean(ids?.length)
  const skip = isIdsMode ? 0 : (page - 1) * limit
  const take = isIdsMode ? Math.min(ids!.length, 50) : limit

  const [totalItems, rows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: productInclude,
      ...(!isIdsMode ? { orderBy } : { orderBy: [{ createdAt: 'desc' }] }),
      skip,
      take,
    }),
  ])

  let ordered = rows
  if (isIdsMode && ids?.length) {
    const order = new Map(ids.map((id, i) => [id, i]))
    ordered = [...rows].sort(
      (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
    )
  }

  return {
    products: ordered.map((p) =>
      mapProduct({
        ...p,
        reviews: p.reviews.map((r) => ({ rating: r.rating })),
      })
    ),
    totalItems,
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findFirst({
    where: { slug, status: 'published' },
    include: productInclude,
  })
  if (!p) return null
  return mapProduct({
    ...p,
    reviews: p.reviews.map((r) => ({ rating: r.rating })),
  })
}

export async function getFeaturedProducts(take: number): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { status: 'published', isFeatured: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take,
  })
  return rows.map((p) =>
    mapProduct({
      ...p,
      reviews: p.reviews.map((r) => ({ rating: r.rating })),
    })
  )
}

export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  take: number
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      status: 'published',
      categoryId,
      id: { not: excludeProductId },
    },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take,
  })
  return rows.map((p) =>
    mapProduct({
      ...p,
      reviews: p.reviews.map((r) => ({ rating: r.rating })),
    })
  )
}

export async function getProductById(id: string): Promise<Product | null> {
  const p = await prisma.product.findFirst({
    where: { id },
    include: productInclude,
  })
  if (!p) return null
  return mapProduct({
    ...p,
    reviews: p.reviews.map((r) => ({ rating: r.rating })),
  })
}
