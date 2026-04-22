import { prisma } from '@/lib/prisma'
import { mapCategory } from '@/lib/data/mappers'
import type { Category } from '@/types'

interface ListCategoriesOptions {
  includeInactive?: boolean
}

export async function listCategories(
  options: ListCategoriesOptions = {}
): Promise<Category[]> {
  const rows = await prisma.category.findMany({
    where: options.includeInactive ? {} : { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
  return rows.map(mapCategory)
}
