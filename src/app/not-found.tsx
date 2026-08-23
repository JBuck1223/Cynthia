import Link from 'next/link'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-5xl text-horizon">That page drifted out.</h1>
        <Link href="/" className="btn-secondary mt-8">
          Back to the sand
        </Link>
      </main>
      <Footer />
    </>
  )
}
