import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

    // If Stripe is not configured, acknowledge the webhook
    if (!stripeSecretKey || stripeSecretKey.includes('placeholder') || !webhookSecret) {
      return NextResponse.json({ received: true })
    }

    // Real Stripe webhook handling
    try {
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

      // Handle specific events
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as import('stripe').Stripe.Checkout.Session
          console.log('Checkout session completed:', session.id)

          // In production:
          // 1. Create the order in the database
          // 2. Update inventory
          // 3. Send confirmation email via SendGrid
          // 4. Clear the cart if server-side
          break
        }

        case 'checkout.session.expired': {
          const session = event.data.object as import('stripe').Stripe.Checkout.Session
          console.log('Checkout session expired:', session.id)

          // In production:
          // 1. Release reserved inventory
          // 2. Optionally send abandoned checkout email
          break
        }

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      return NextResponse.json({ received: true })
    } catch (stripeError) {
      console.error('Stripe webhook error:', stripeError)
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
