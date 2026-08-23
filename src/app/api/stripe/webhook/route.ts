import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { productForSku } from '@/lib/products'

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object
  const email = session.customer_details?.email || session.customer_email
  const sku = session.metadata?.sku
  if (!email || !sku) {
    return NextResponse.json({ received: true, skipped: 'missing email or sku' })
  }

  const product = productForSku(sku)
  const admin = createAdminClient()
  if (!admin || !product) {
    return NextResponse.json({ received: true, skipped: 'no admin client' })
  }

  const { data: existing } = await admin.from('profiles').select('id').eq('email', email).maybeSingle()
  let userId = existing?.id as string | undefined

  if (!userId) {
    const created = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    })
    userId = created.data.user?.id
    if (userId) {
      await admin.from('profiles').upsert({
        id: userId,
        email,
        full_name: session.customer_details?.name ?? null,
      })
    }
  }

  if (!userId) {
    return NextResponse.json({ error: 'Could not create user' }, { status: 500 })
  }

  const { data: order } = await admin
    .from('orders')
    .insert({
      user_id: userId,
      email,
      sku: product.sku,
      amount_cents: session.amount_total ?? product.priceCents,
      stripe_session_id: session.id,
      status: 'paid',
    })
    .select('id')
    .single()

  for (const courseSlug of product.courseSlugs) {
    await admin.from('course_entitlements').upsert(
      { user_id: userId, course_slug: courseSlug, order_id: order?.id ?? null },
      { onConflict: 'user_id,course_slug' },
    )
  }

  return NextResponse.json({ received: true })
}
