import type { Order } from '@/types'

const webhookUrl = process.env.SLACK_ORDER_WEBHOOK_URL
const isConfigured = webhookUrl && !webhookUrl.includes('placeholder')

export async function sendOrderNotification(order: Order) {
  if (!isConfigured) {
    console.log(
      `[Slack Mock] New order ${order.orderNumber} — $${order.total.toFixed(2)} from ${order.email}`
    )
    return
  }

  const itemLines = order.items
    .map(
      (item) =>
        `${item.productName} (${item.variantName}) — ${item.quantity} × $${item.unitPrice.toFixed(2)}`
    )
    .join('\n')

  const breakdownParts = [`Subtotal: $${order.subtotal.toFixed(2)}`]
  if (order.discount > 0) {
    breakdownParts.push(`Discount: -$${order.discount.toFixed(2)}`)
  }
  breakdownParts.push(`Shipping: ${order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : 'Free'}`)
  breakdownParts.push(`*Total: $${order.total.toFixed(2)} ${order.currency.toUpperCase()}*`)

  const addr = order.shippingAddress
  const addressLine = [addr.city, addr.state, addr.country].filter(Boolean).join(', ')

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const adminLink = `${siteUrl}/admin/orders/${order.id}`

  const payload = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `New Order ${order.orderNumber} — $${order.total.toFixed(2)}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Customer:*\n${order.email}` },
          { type: 'mrkdwn', text: `*Ship To:*\n${addressLine}` },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Items:*\n${itemLines}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: breakdownParts.join('\n'),
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View in Admin', emoji: true },
            url: adminLink,
          },
        ],
      },
    ],
  }

  try {
    const res = await fetch(webhookUrl!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error(`[Slack] Webhook returned ${res.status}: ${await res.text()}`)
    }
  } catch (error) {
    console.error('[Slack] Failed to send order notification:', error)
  }
}
