import sgMail from '@sendgrid/mail'

const apiKey = process.env.SENDGRID_API_KEY
const isConfigured = apiKey && !apiKey.includes('placeholder')

if (isConfigured) {
  sgMail.setApiKey(apiKey)
}

interface OrderConfirmationParams {
  to: string
  orderNumber: string
  items: Array<{
    productName: string
    variantName: string
    quantity: number
    unitPrice: number
  }>
  total: number
  shippingAddress: {
    name: string
    line1: string
    line2?: string | null
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export async function sendOrderConfirmation(params: OrderConfirmationParams) {
  if (!isConfigured) {
    console.log('[SendGrid Mock] Order confirmation email:', params.orderNumber)
    return
  }

  const { to, orderNumber, items, total, shippingAddress } = params

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          ${item.productName}<br>
          <small style="color: #666;">${item.variantName}</small>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          $${(item.unitPrice * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('')

  await sgMail.send({
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: 'ÀṢÀ Fashion',
    },
    subject: `Order Confirmed - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1A1714; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #C19A3E; margin: 0;">ÀṢÀ</h1>
          <p style="color: #666; margin: 5px 0;">Premium African Fashion</p>
        </div>
        <div style="background: #F8F6F1; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin-top: 0;">Thank you for your order!</h2>
          <p>We've received your order and are preparing it for shipment.</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
        </div>
        <h3>Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #6B2D3C; color: white;">
              <th style="padding: 12px; text-align: left;">Item</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 12px; text-align: right; font-weight: bold;">$${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <h3 style="margin-top: 30px;">Shipping Address</h3>
        <p style="background: #F8F6F1; padding: 15px; border-radius: 8px;">
          ${shippingAddress.name}<br>
          ${shippingAddress.line1}<br>
          ${shippingAddress.line2 ? shippingAddress.line2 + '<br>' : ''}
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
          ${shippingAddress.country}
        </p>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Questions? Reply to this email or contact us at support@asa-fashion.com
          </p>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendShippingNotification(params: {
  to: string
  orderNumber: string
  trackingNumber: string
  carrier: string
}) {
  if (!isConfigured) {
    console.log('[SendGrid Mock] Shipping notification:', params.orderNumber)
    return
  }

  await sgMail.send({
    to: params.to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: 'ÀṢÀ Fashion',
    },
    subject: `Your Order Has Shipped - ${params.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1A1714; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #C19A3E; margin: 0;">ÀṢÀ</h1>
        </div>
        <div style="background: #F8F6F1; padding: 20px; border-radius: 8px;">
          <h2 style="margin-top: 0;">Your order is on its way!</h2>
          <p><strong>Order:</strong> ${params.orderNumber}</p>
          <p><strong>Carrier:</strong> ${params.carrier}</p>
          <p><strong>Tracking Number:</strong> ${params.trackingNumber}</p>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendLowStockAlert(params: {
  productName: string
  variantName: string
  currentStock: number
}) {
  if (!isConfigured) {
    console.log('[SendGrid Mock] Low stock alert:', params.productName, params.currentStock)
    return
  }

  await sgMail.send({
    to: process.env.SENDGRID_FROM_EMAIL!,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: 'ÀṢÀ Inventory',
    },
    subject: `Low Stock Alert: ${params.productName}`,
    html: `
      <h2>Low Stock Alert</h2>
      <p><strong>Product:</strong> ${params.productName}</p>
      <p><strong>Variant:</strong> ${params.variantName}</p>
      <p><strong>Current Stock:</strong> ${params.currentStock}</p>
    `,
  })
}
