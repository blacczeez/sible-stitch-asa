export interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  image: string
  price: number
  size: string
  color: string
  quantity: number
  slug: string
}

export interface Cart {
  items: CartItem[]
  promoCode: string | null
  discount: number
}
