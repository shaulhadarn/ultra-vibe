import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const PLANS = {
  free: {
    name: 'Free',
    credits: 10,
    priceId: null,
  },
  pro: {
    name: 'Pro',
    credits: 100,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  ultra: {
    name: 'Ultra',
    credits: 500,
    priceId: process.env.STRIPE_ULTRA_PRICE_ID,
  },
} as const