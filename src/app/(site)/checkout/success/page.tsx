import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'You are in' }

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto max-w-lg px-5 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-gulf">Paid</p>
      <h1 className="font-display mt-3 text-4xl text-horizon">The piano is yours.</h1>
      <p className="mt-4 text-muted">
        Use the same email you paid with. We will send a login link to open your studio.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex rounded-full bg-gulf px-6 py-3 text-sm text-foam hover:bg-gulf-deep"
      >
        Open the studio
      </Link>
    </main>
  )
}
