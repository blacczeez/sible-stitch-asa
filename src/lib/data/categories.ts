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
  const includeInactive = options.includeInactive === true
  const orderBy = { sortOrder: 'asc' } as Prisma.CategoryOrderByWithRelationInput

  try {
    const where = includeInactive
      ? {}
      : ({ isActive: true } as Record<string, unknown>)

    const rows = await prisma.category.findMany({
      where: where as Prisma.CategoryWhereInput,
      orderBy,
    })
    return rows.map(mapCategory)
  } catch (error) {
    // Compatibility fallback for environments where Prisma client was generated
    // before Category.isActive existed.
    const message = error instanceof Error ? error.message : ''
    if (!message.includes('Unknown argument `isActive`')) {
      throw error
    }

    const rows = await prisma.category.findMany({ orderBy })
    const mapped = rows.map(mapCategory)
    return includeInactive ? mapped : mapped.filter((c) => c.isActive)
  }
}
