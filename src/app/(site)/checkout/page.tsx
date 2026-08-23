'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { productForSku } from '@/lib/products'
import { formatPrice } from '@/lib/catalog'

function CheckoutForm() {
  const params = useSearchParams()
  const router = useRouter()
  const sku = params.get('sku') || ''
  const product = productForSku(sku)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!product) {
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-4xl text-horizon">Nothing to buy yet</h1>
        <button className="btn-secondary mt-8" onClick={() => router.push('/courses')}>
          Back to courses
        </button>
      </main>
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, email }),
    })
    const data = await res.json()
    if (!res.ok || !data.url) {
      setError(data.error || 'Checkout is not ready. Stripe keys still need to be added.')
      setLoading(false)
      return
    }
    window.location.href = data.url
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-20 md:py-28">
      <p className="kicker">Checkout</p>
      <h1 className="font-display mt-5 text-4xl text-horizon md:text-5xl">{product.name}</h1>
      <p className="mt-3 text-2xl font-semibold text-gulf-deep">{formatPrice(product.priceCents)}</p>
      <form onSubmit={onSubmit} className="card mt-10 space-y-5 p-8">
        <label className="block text-base text-horizon">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-card-border bg-sand px-4 py-3.5 text-horizon outline-none focus:border-gulf"
            placeholder="you@email.com"
          />
        </label>
        {error && <p className="text-base text-coral-deep">{error}</p>}
        <button type="submit" disabled={loading} className="btn w-full bg-coral text-foam hover:bg-coral-deep disabled:opacity-60">
          {loading ? 'Redirecting…' : 'Continue to payment'}
        </button>
      </form>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  )
}
