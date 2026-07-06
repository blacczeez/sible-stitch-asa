import { unstable_cache } from 'next/cache'
import { productQuerySchema } from '@/validations/product'
import { listProducts } from '@/lib/data/products'
import { listCategories } from '@/lib/data/categories'
import { ProductsView } from './products-view'

const getCachedCategories = unstable_cache(
  () => listCategories(),
  ['categories'],
  { revalidate: 120, tags: ['categories'] }
)

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const raw = await searchParams
  const query = productQuerySchema.parse(raw)

  // Cache key includes the serialized query so different filter combos are cached independently
  const queryKey = JSON.stringify(query)
  const getCachedProducts = unstable_cache(
    () => listProducts(query),
    ['products', queryKey],
    { revalidate: 60, tags: ['products'] }
  )

  const [{ products, totalItems }, categories] = await Promise.all([
    getCachedProducts(),
    getCachedCategories(),
  ])

  const totalPages = Math.ceil(totalItems / query.limit)

  // Derive category title
  let categoryTitle = 'All Products'
  if (query.search) {
    categoryTitle = `Search: "${query.search}"`
  } else if (query.category?.length) {
    if (query.category.length === 1) {
      const match = categories.find((c) => c.slug === query.category![0])
      categoryTitle =
        match?.name ||
        query.category[0].charAt(0).toUpperCase() + query.category[0].slice(1)
    } else {
      const names = query.category.map((slug) => {
        const match = categories.find((c) => c.slug === slug)
        return match?.name || slug.charAt(0).toUpperCase() + slug.slice(1)
      })
      categoryTitle = names.join(', ')
    }
  }

  return (
    <ProductsView
      products={products}
      totalPages={totalPages}
      totalItems={totalItems}
      currentPage={query.page}
      categoryTitle={categoryTitle}
    />
  )
}
