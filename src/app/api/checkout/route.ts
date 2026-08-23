import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { productForSku, stripePriceEnv } from '@/lib/products'

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Checkout is not configured yet.' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const sku = typeof body.sku === 'string' ? body.sku : ''
  const product = productForSku(sku)
  if (!product) {
    return NextResponse.json({ error: 'Unknown product.' }, { status: 400 })
  }

  const priceId = stripePriceEnv(sku)
  const origin = request.nextUrl.origin

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: typeof body.email === 'string' ? body.email : undefined,
    line_items: priceId
      ? [{ price: priceId, quantity: 1 }]
      : [
          {
            quantity: 1,
            price_data: {
              currency: 'usd',
              unit_amount: product.priceCents,
              product_data: { name: product.name },
            },
          },
        ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/courses`,
    metadata: {
      sku: product.sku,
      course_slugs: product.courseSlugs.join(','),
    },
  })

  return NextResponse.json({ url: session.url })
}
