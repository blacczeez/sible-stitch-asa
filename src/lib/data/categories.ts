import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { mapCategory } from '@/lib/data/mappers'
import type { Category } from '@/types'

interface ListCategoriesOptions {
  includeInactive?: boolean
}

export async function listCategories(
  options: ListCategoriesOptions = {}
): Promise<Category[]> {
  const where = (options.includeInactive
    ? {}
    : ({ isActive: true } as Record<string, unknown>)) as Prisma.CategoryWhereInput

  const rows = await prisma.category.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
  })
  return rows.map(mapCategory)
}
