import { prisma } from '@/lib/prisma'
import { GUEST_REVIEW_USER_EMAIL } from '@/lib/data/constants'
import { mapReview } from '@/lib/data/mappers'
import type { Review } from '@/types'

export async function getGuestReviewUserId(): Promise<string> {
  const u = await prisma.user.findUnique({
    where: { email: GUEST_REVIEW_USER_EMAIL },
    select: { id: true },
  })
  if (!u) {
    throw new Error(
      `Missing guest review user (${GUEST_REVIEW_USER_EMAIL}). Run prisma migrate/seed.`
    )
  }
  return u.id
}

export async function listReviewsForProduct(productId: string): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(mapReview)
}

export async function createGuestProductReview(input: {
  productId: string
  rating: number
  title: string
  body: string
}): Promise<Review> {
  const userId = await getGuestReviewUserId()

  const product = await prisma.product.findFirst({
    where: { id: input.productId, status: 'published' },
    select: { id: true },
  })
  if (!product) {
    throw new Error('Product not found')
  }

  const row = await prisma.review.create({
    data: {
      rating: input.rating,
      title: input.title,
      body: input.body,
      productId: input.productId,
      userId,
      isVerified: false,
    },
    include: { user: { select: { name: true, email: true } } },
  })

  return mapReview(row)
}
