import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { db, users, creditLedger } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object

      const userId = session.metadata?.userId
      const plan = session.metadata?.plan

      if (userId && plan) {
        const planDetails = PLANS[plan as keyof typeof PLANS]

        if (planDetails) {
          // Update user plan and add credits
          await db.update(users)
            .set({
              plan,
              credits: planDetails.credits,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId))

          // Log credit addition
          await db.insert(creditLedger).values({
            userId,
            amount: planDetails.credits,
            type: 'plan_purchase',
            description: `Upgraded to ${planDetails.name} plan`,
          })

          console.log('Checkout completed:', userId, plan)
        }
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object

      // Find user by customer ID (you'd store this during checkout)
      // For now, this is a simplified example
      console.log('Subscription deleted:', subscription.id)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object
      console.log('Payment succeeded:', invoice.id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      console.log('Payment failed:', invoice.id)
      break
    }

    default:
      console.log('Unhandled event type:', event.type)
  }

  return NextResponse.json({ received: true })
}
