import { prisma } from '@/lib/prisma'
import { mapCategory } from '@/lib/data/mappers'
import type { Category } from '@/types'

export async function listCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  return rows.map(mapCategory)
}
