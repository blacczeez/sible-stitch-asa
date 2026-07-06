import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, markOrderPaidFromStripe } from '@/lib/data/orders'
import { sendOrderConfirmation } from '@/lib/sendgrid'
import { sendOrderNotification } from '@/lib/slack'

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

    if (!stripeSecretKey || stripeSecretKey.includes('placeholder') || !webhookSecret) {
      return NextResponse.json({ received: true })
    }

    const stripe = (await import('stripe')).default
    const stripeClient = new stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    })

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: import('stripe').Stripe.Event

    try {
      event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (verifyError) {
      console.error('Webhook signature verification failed:', verifyError)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as import('stripe').Stripe.Checkout.Session
        const orderId = session.metadata?.orderId
        if (!orderId) {
          console.warn('checkout.session.completed missing metadata.orderId')
          break
        }

        const paymentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent &&
                typeof session.payment_intent === 'object' &&
                'id' in session.payment_intent
              ? (session.payment_intent as { id: string }).id
              : session.id

        await markOrderPaidFromStripe({ orderId, stripePaymentId: paymentId })

        const paidOrder = await getOrderById(orderId)
        if (paidOrder) {
          sendOrderNotification(paidOrder).catch(() => {})
          sendOrderConfirmation({
            to: paidOrder.email,
            orderId: paidOrder.id,
            orderNumber: paidOrder.orderNumber,
            items: paidOrder.items.map((item) => ({
              productName: item.productName,
              variantName: item.variantName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
            total: paidOrder.total,
            shippingAddress: paidOrder.shippingAddress,
          }).catch(() => {})
        }

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as import('stripe').Stripe.Checkout.Session
        console.log('Checkout session expired:', session.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
