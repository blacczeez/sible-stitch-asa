import { NextRequest, NextResponse } from 'next/server'
import { checkoutBodySchema } from '@/validations/checkout'
import {
  createGuestOrder,
  resolveCheckoutLines,
  validatePromoDiscount,
} from '@/lib/data/orders'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = checkoutBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid checkout data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { shipping, currency, items, promoCode } = parsed.data
    const email = shipping.email

    const resolvedLines = await resolveCheckoutLines(items)
    const subtotal =
      Math.round(
        resolvedLines.reduce((s, l) => s + l.lineTotal, 0) * 100
      ) / 100

    const { discount, promoCodeId } = await validatePromoDiscount({
      code: promoCode ?? null,
      subtotal,
    })

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
    const useMockStripe =
      !stripeSecretKey || stripeSecretKey.includes('placeholder')

    if (useMockStripe) {
      const order = await createGuestOrder({
        email,
        shipping,
        currency,
        lines: resolvedLines,
        discount,
        promoCodeId,
        mode: 'paid_mock',
      })

      return NextResponse.json({
        checkoutUrl: null,
        orderId: order.id,
        mock: true,
      })
    }

    const pendingOrder = await createGuestOrder({
      email,
      shipping,
      currency,
      lines: resolvedLines,
      discount,
      promoCodeId,
      mode: 'pending_stripe',
    })

    const stripe = (await import('stripe')).default
    const stripeClient = new stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    })

    const origin = request.headers.get('origin') || 'http://localhost:3000'
    const totalCents = Math.round(pendingOrder.total * 100)

    const session = await stripeClient.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      currency: currency.toLowerCase(),
      customer_email: email,
      client_reference_id: pendingOrder.id,
      metadata: {
        orderId: pendingOrder.id,
      },
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Order ${pendingOrder.orderNumber}`,
              description: 'ÀṢÀ — e-commerce order',
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/orders/${pendingOrder.id}?success=true`,
      cancel_url: `${origin}/checkout?canceled=true`,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create Stripe Checkout session' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      checkoutUrl: session.url,
      orderId: pendingOrder.id,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Error creating checkout:', error)
    const message = error instanceof Error ? error.message : 'Checkout failed'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}
