import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'You are in' }

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto max-w-lg px-5 py-24 text-center">
      <p className="kicker">Paid</p>
      <h1 className="font-display mt-5 text-4xl text-horizon md:text-5xl">The piano is yours.</h1>
      <p className="mt-5 text-xl text-muted">
        Use the same email you paid with. We will send a login link to open your studio.
      </p>
      <Link href="/login" className="btn mt-10 bg-gulf text-foam hover:bg-gulf-deep">
        Open the studio
      </Link>
    </main>
  )
}
