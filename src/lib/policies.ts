import {
  BRAND,
  FREE_SHIPPING_THRESHOLD,
  MADE_TO_ORDER_LEAD_TIME,
  RETURN_WINDOW_DAYS,
  STANDARD_SHIPPING,
} from '@/lib/constants'

export const FAQ_ITEMS = [
  {
    question: 'What does made to order mean?',
    answer: `Every piece is crafted specifically for you after your order is placed. Production takes ${MADE_TO_ORDER_LEAD_TIME}, after which your order ships. This ensures a perfect fit and reduces waste.`,
  },
  {
    question: 'How long does shipping take?',
    answer: `Because our pieces are made to order, please allow ${MADE_TO_ORDER_LEAD_TIME} for production before shipping. Once shipped, domestic delivery typically takes 5–10 business days and international orders 10–21 business days. You will receive a tracking number when your order ships.`,
  },
  {
    question: `Do you offer free shipping?`,
    answer: `Yes. All orders over $${FREE_SHIPPING_THRESHOLD} qualify for free standard shipping worldwide. Orders below that threshold are charged a flat $${STANDARD_SHIPPING} shipping fee.`,
  },
  {
    question: 'What is your return policy?',
    answer: `We offer a ${RETURN_WINDOW_DAYS}-day hassle-free return policy on unworn items in their original condition with tags attached. Sale items and custom-made pieces are final sale unless defective.`,
  },
  {
    question: 'How do I start a return?',
    answer: `Email us at ${BRAND.email} with your order number and the items you wish to return. We will provide a return authorization and instructions within 1–2 business days.`,
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay. All transactions are secured with SSL encryption via Stripe.',
  },
  {
    question: 'How do I find my size?',
    answer: 'Visit our Size Guide for detailed measurements for tops, bottoms, and dresses. If you are between sizes, we recommend sizing up for a more comfortable fit.',
  },
  {
    question: 'Are your fabrics authentic?',
    answer: 'Yes. Our Ankara prints and African-inspired fabrics are sourced from trusted suppliers and each piece is made to order with premium quality materials.',
  },
  {
    question: 'Can I track my order?',
    answer: `Once your order ships, you will receive an email with tracking information. You can also contact us at ${BRAND.email} with your order number for an update.`,
  },
] as const

export const SHIPPING_SECTIONS = [
  {
    title: 'Made to Order',
    content: `All ${BRAND.name} pieces are made to order. After you place your order, our artisans begin crafting your garment. Please allow ${MADE_TO_ORDER_LEAD_TIME} for production before your order ships. You will receive a confirmation email when your order is placed and a shipping notification with tracking once it is on its way.`,
  },
  {
    title: 'Shipping Rates',
    content: `Standard shipping is $${STANDARD_SHIPPING} on orders under $${FREE_SHIPPING_THRESHOLD}. Orders of $${FREE_SHIPPING_THRESHOLD} or more ship free worldwide. Shipping costs are calculated automatically at checkout.`,
  },
  {
    title: 'Delivery Estimates',
    content:
      'Domestic orders (US, UK, Canada) typically arrive within 5–10 business days after shipping. International orders may take 10–21 business days depending on destination and customs processing. Total time from order to delivery includes production time plus transit. Delivery times are estimates and not guaranteed.',
  },
  {
    title: 'International Shipping',
    content:
      'We ship worldwide. International customers are responsible for any customs duties, taxes, or import fees charged by their country. These fees are not included in your order total and are collected by the carrier upon delivery.',
  },
] as const

export const RETURN_SECTIONS = [
  {
    title: 'Return Window',
    content: `You may return unworn, unwashed items in their original condition with all tags attached within ${RETURN_WINDOW_DAYS} days of delivery for a full refund to your original payment method.`,
  },
  {
    title: 'Non-Returnable Items',
    content:
      'Sale items marked as final sale, custom or made-to-order pieces, and items showing signs of wear or damage cannot be returned. Gift cards are also non-refundable.',
  },
  {
    title: 'How to Return',
    content: `Email ${BRAND.email} with your order number, the items you wish to return, and the reason. We will send you a return authorization and prepaid shipping label (where applicable) within 1–2 business days.`,
  },
  {
    title: 'Refunds',
    content:
      'Once we receive and inspect your return, refunds are processed within 5–7 business days. Please allow an additional 3–5 business days for the refund to appear on your statement depending on your bank.',
  },
  {
    title: 'Exchanges',
    content: `Need a different size? Contact us at ${BRAND.email} and we will help arrange an exchange, subject to availability. Exchanges follow the same ${RETURN_WINDOW_DAYS}-day window as returns.`,
  },
] as const
