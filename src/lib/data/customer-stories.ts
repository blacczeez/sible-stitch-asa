import { prisma } from '@/lib/prisma'
import { mapCustomerStory } from '@/lib/data/mappers'
import {
  deleteFromCloudinary,
  extractCloudinaryPublicId,
  isCloudinaryConfigured,
} from '@/lib/cloudinary'
import type { CustomerStory, CustomerStoryMediaType, ReviewSubmission } from '@/types'
import type { CustomerStoryInput } from '@/validations/admin'

const storyInclude = {
  product: { select: { id: true, name: true, slug: true, images: true } },
} as const

export async function listPublishedCustomerStories(): Promise<CustomerStory[]> {
  const rows = await prisma.customerStory.findMany({
    where: { status: 'published' },
    include: storyInclude,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return rows.map(mapCustomerStory)
}

export async function listAdminCustomerStories(): Promise<CustomerStory[]> {
  const rows = await prisma.customerStory.findMany({
    include: storyInclude,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return rows.map(mapCustomerStory)
}

export async function getCustomerStoryById(id: string): Promise<CustomerStory | null> {
  const row = await prisma.customerStory.findUnique({
    where: { id },
    include: storyInclude,
  })
  return row ? mapCustomerStory(row) : null
}

export async function createCustomerStory(
  input: CustomerStoryInput
): Promise<CustomerStory> {
  const row = await prisma.customerStory.create({
    data: {
      customerName: input.customerName,
      description: input.description,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
      productId: input.productId,
      status: input.status,
      sortOrder: input.sortOrder,
      sourceReviewId: input.sourceReviewId ?? null,
    },
    include: storyInclude,
  })
  return mapCustomerStory(row)
}

export async function updateCustomerStory(
  id: string,
  input: CustomerStoryInput
): Promise<CustomerStory> {
  const row = await prisma.customerStory.update({
    where: { id },
    data: {
      customerName: input.customerName,
      description: input.description,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
      productId: input.productId,
      status: input.status,
      sortOrder: input.sortOrder,
      sourceReviewId: input.sourceReviewId ?? null,
    },
    include: storyInclude,
  })
  return mapCustomerStory(row)
}

export async function deleteCustomerStory(id: string): Promise<void> {
  await prisma.customerStory.delete({ where: { id } })
}

/** Remove Cloudinary asset when no story, product, or category still references it. */
export async function cleanupCustomerStoryMediaIfOrphaned(
  mediaUrl: string,
  mediaType: CustomerStoryMediaType
): Promise<void> {
  if (!mediaUrl || !isCloudinaryConfigured()) return

  const publicId = extractCloudinaryPublicId(mediaUrl)
  if (!publicId) return

  const [storyCount, productCount, categoryCount] = await Promise.all([
    prisma.customerStory.count({ where: { mediaUrl } }),
    mediaType === 'image'
      ? prisma.product.count({ where: { images: { has: mediaUrl } } })
      : Promise.resolve(0),
    mediaType === 'image'
      ? prisma.category.count({ where: { image: mediaUrl } })
      : Promise.resolve(0),
  ])

  if (storyCount > 0 || productCount > 0 || categoryCount > 0) return

  try {
    await deleteFromCloudinary(publicId, {
      resourceType: mediaType === 'video' ? 'video' : 'image',
    })
  } catch (error) {
    console.error('Failed to delete Cloudinary media for customer story:', error)
  }
}

export async function listReviewSubmissions(): Promise<ReviewSubmission[]> {
  const rows = await prisma.review.findMany({
    include: {
      product: { select: { id: true, name: true, slug: true } },
      customerStory: { select: { id: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    customerName: r.title,
    body: r.body,
    productId: r.productId,
    productName: r.product.name,
    productSlug: r.product.slug,
    createdAt: r.createdAt.toISOString(),
    hasStory: Boolean(r.customerStory),
    storyId: r.customerStory?.id ?? null,
    storyStatus: r.customerStory?.status ?? null,
  }))
}
