import { prisma } from '@/lib/prisma'
import { STOCK_THRESHOLDS } from '@/lib/constants'

export type DashboardStats = {
  revenue: {
    today: number
    thisWeek: number
    thisMonth: number
    growth: number
  }
  orders: {
    pending: number
    processing: number
    shipped: number
    total: number
  }
  inventory: {
    lowStock: number
    outOfStock: number
  }
  topProducts: {
    id: string
    name: string
    sold: number
    revenue: number
  }[]
  recentOrders: {
    id: string
    orderNumber: string
    customer: string
    total: number
    status: string
    createdAt: string
  }[]
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function startOfWeek(d: Date) {
  const x = startOfDay(d)
  const day = x.getDay()
  const diff = x.getDate() - day + (day === 0 ? -6 : 1)
  x.setDate(diff)
  return x
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date()
  const todayStart = startOfDay(now)
  const weekStart = startOfWeek(now)
  const monthStart = startOfMonth(now)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthEnd = monthStart

  const [
    paidToday,
    paidWeek,
    paidThisMonth,
    paidPrevMonth,
    orderCounts,
    totalOrders,
    lowStock,
    outOfStock,
    recentOrders,
    topOrderItems,
  ] = await prisma.$transaction([
    prisma.order.aggregate({
      where: { paidAt: { gte: todayStart }, status: { not: 'canceled' } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { paidAt: { gte: weekStart }, status: { not: 'canceled' } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { paidAt: { gte: monthStart }, status: { not: 'canceled' } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        paidAt: { gte: prevMonthStart, lt: prevMonthEnd },
        status: { not: 'canceled' },
      },
      _sum: { total: true },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { _all: true },
      orderBy: { status: 'asc' },
    }),
    prisma.order.count(),
    prisma.productVariant.count({
      where: {
        stock: { gt: 0, lte: STOCK_THRESHOLDS.LOW },
      },
    }),
    prisma.productVariant.count({
      where: { stock: STOCK_THRESHOLDS.OUT },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        shippingAddress: true,
      },
    }),
    prisma.orderItem.groupBy({
      by: ['productName'],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: 5,
    }),
  ])

  const thisMonth = paidThisMonth._sum.total?.toNumber() ?? 0
  const prevMonth = paidPrevMonth._sum.total?.toNumber() ?? 0
  const growth =
    prevMonth > 0 ? Math.round(((thisMonth - prevMonth) / prevMonth) * 1000) / 10 : 0

  const statusMap = Object.fromEntries(
    orderCounts.map((r) => {
      const n =
        typeof r._count === 'object' && r._count !== null && '_all' in r._count
          ? (r._count as { _all: number })._all
          : 0
      return [r.status, n]
    })
  ) as Record<string, number>

  const productIds = await prisma.product.findMany({
    where: {
      name: { in: topOrderItems.map((t) => t.productName) },
    },
    select: { id: true, name: true },
  })
  const nameToId = new Map(productIds.map((p) => [p.name, p.id]))

  return {
    revenue: {
      today: paidToday._sum.total?.toNumber() ?? 0,
      thisWeek: paidWeek._sum.total?.toNumber() ?? 0,
      thisMonth,
      growth,
    },
    orders: {
      pending: statusMap.pending ?? 0,
      processing: statusMap.processing ?? 0,
      shipped: statusMap.shipped ?? 0,
      total: totalOrders,
    },
    inventory: {
      lowStock,
      outOfStock,
    },
    topProducts: topOrderItems.map((t) => ({
      id: nameToId.get(t.productName) ?? t.productName,
      name: t.productName,
      sold: t._sum?.quantity ?? 0,
      revenue: t._sum?.totalPrice?.toNumber() ?? 0,
    })),
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.shippingAddress.name,
      total: o.total.toNumber(),
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    })),
  }
}
