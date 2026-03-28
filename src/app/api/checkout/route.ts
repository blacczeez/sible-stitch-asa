import { NextRequest, NextResponse } from 'next/server'
import { checkoutSessionSchema } from '@/validations/checkout'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = checkoutSessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid checkout data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { shipping, currency } = parsed.data

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

    // If Stripe is not configured (placeholder key), redirect to mock order confirmation
    if (!stripeSecretKey || stripeSecretKey.includes('placeholder')) {
      const mockOrderId = 'mock-order-id'
      return NextResponse.json({
        url: `/orders/${mockOrderId}?success=true`,
        orderId: mockOrderId,
        mock: true,
      })
    }

    // Real Stripe checkout session
    try {
      const stripe = (await import('stripe')).default
      const stripeClient = new stripe(stripeSecretKey, {
        apiVersion: '2025-08-27.basil',
      })

      const origin = request.headers.get('origin') || 'http://localhost:3000'

      const session = await stripeClient.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        currency: currency.toLowerCase(),
        customer_email: shipping.email,
        shipping_address_collection: {
          allowed_countries: ['US', 'GB', 'CA', 'DE', 'FR', 'NG', 'GH', 'KE', 'ZA'],
        },
        metadata: {
          shippingName: `${shipping.firstName} ${shipping.lastName}`,
          shippingPhone: shipping.phone,
          shippingLine1: shipping.line1,
          shippingLine2: shipping.line2 || '',
          shippingCity: shipping.city,
          shippingState: shipping.state,
          shippingPostalCode: shipping.postalCode,
          shippingCountry: shipping.country,
        },
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: 'ASA Order',
                description: 'E-commerce order from ASA',
              },
              unit_amount: 0, // Would be calculated from cart items
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/orders/{CHECKOUT_SESSION_ID}?success=true`,
        cancel_url: `${origin}/checkout?canceled=true`,
      })

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
      })
    } catch (stripeError) {
      console.error('Stripe error:', stripeError)
      return NextResponse.json(
        { error: 'Failed to create Stripe checkout session' },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('Error creating checkout:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
