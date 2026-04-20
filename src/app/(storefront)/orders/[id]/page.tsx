import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { getOrderById } from '@/lib/data/orders'
import { OrderDetailContent } from './order-detail-content'

interface OrderPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = await params
  const sp = await searchParams
  const isSuccess = sp.success === 'true'

  const getCachedOrder = unstable_cache(
    () => getOrderById(id),
    ['order', id],
    { revalidate: 30, tags: ['orders', `order-${id}`] }
  )

  const order = await getCachedOrder()
  if (!order) notFound()

  return <OrderDetailContent order={order} isSuccess={isSuccess} />
}
