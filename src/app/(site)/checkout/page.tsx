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
      <main className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-horizon">Nothing to buy yet</h1>
        <button className="mt-6 text-gulf" onClick={() => router.push('/courses')}>
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
    <main className="mx-auto max-w-md px-5 py-24">
      <p className="text-xs uppercase tracking-[0.28em] text-gulf">Checkout</p>
      <h1 className="font-display mt-3 text-3xl text-horizon">{product.name}</h1>
      <p className="mt-2 text-muted">{formatPrice(product.priceCents)}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-card-border bg-foam p-6">
        <label className="block text-sm text-horizon">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-sand px-3 py-2.5 text-horizon outline-none focus:border-gulf"
            placeholder="you@email.com"
          />
        </label>
        {error && <p className="text-sm text-coral-deep">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-coral py-3 text-sm font-medium text-foam hover:bg-coral-deep disabled:opacity-60"
        >
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
