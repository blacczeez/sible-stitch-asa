export type CustomerStoryStatus = 'draft' | 'published'
export type CustomerStoryMediaType = 'image' | 'video'

export interface CustomerStory {
  id: string
  customerName: string
  description: string
  mediaUrl: string
  mediaType: CustomerStoryMediaType
  status: CustomerStoryStatus
  sortOrder: number
  productId: string
  productName: string
  productSlug: string
  productImage: string | null
  sourceReviewId: string | null
  createdAt: string
  updatedAt: string
}

export interface ReviewSubmission {
  id: string
  rating: number
  customerName: string | null
  body: string | null
  productId: string
  productName: string
  productSlug: string
  createdAt: string
  hasStory: boolean
  storyId: string | null
  storyStatus: CustomerStoryStatus | null
}
