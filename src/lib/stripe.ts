import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey && !stripeSecretKey.includes('placeholder')
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  : null

export function isStripeConfigured(): boolean {
  return stripe !== null
}
