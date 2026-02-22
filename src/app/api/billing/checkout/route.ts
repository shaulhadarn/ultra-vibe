import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await req.json()

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const planDetails = PLANS[plan as keyof typeof PLANS]

    if (!planDetails.priceId) {
      return NextResponse.json({ error: 'Cannot checkout for free plan' }, { status: 400 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: planDetails.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: (process.env.NEXT_PUBLIC_APP_URL || '') + '/billing?success=true',
      cancel_url: (process.env.NEXT_PUBLIC_APP_URL || '') + '/billing?canceled=true',
      metadata: {
        userId: user.id,
        plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
