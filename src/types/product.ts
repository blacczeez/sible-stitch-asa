export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  image: string | null
  sortOrder: number
  isActive: boolean
}

export interface ProductVariant {
  id: string
  size: string
  color: string
  sku: string
  stock: number
  price: number | null
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  comparePrice: number | null
  images: string[]
  isFeatured: boolean
  status: 'draft' | 'published' | 'archived'
  categoryId: string
  category: Category
  variants: ProductVariant[]
  averageRating: number | null
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  rating: number
  title: string | null
  body: string | null
  isVerified: boolean
  userId: string
  userName: string
  productId: string
  createdAt: string
}

export interface SizeGuideEntry {
  id: string
  category: string
  size: string
  bust: string | null
  waist: string | null
  hips: string | null
  length: string | null
  shoulders: string | null
}
