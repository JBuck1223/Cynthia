export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { getEntitledSlugs, getSessionUser } from '@/lib/access'
import { courses, formatPrice, books } from '@/lib/catalog'

export const metadata = { title: 'Studio' }

export default async function StudioPage() {
  const user = await getSessionUser()
  const entitled = user ? await getEntitledSlugs(user.id) : []

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-gulf">Your studio</p>
      <h1 className="font-display mt-3 text-4xl text-horizon">
        {user ? 'Pick up where you left off.' : 'Log in to open the full courses.'}
      </h1>
      {!user && (
        <p className="mt-4 text-muted">
          Previews are free. After you buy, we email a login link.{' '}
          <Link href="/login" className="text-gulf-deep">
            Get a link
          </Link>
        </p>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {courses.map((course) => {
          const owned = entitled.includes(course.slug)
          const href = `/studio/${course.slug}/${course.lessons[0].slug}`
          return (
            <article key={course.slug} className="overflow-hidden rounded-3xl border border-card-border bg-foam">
              <Image src={course.cover} alt="" width={800} height={400} className="h-40 w-full object-cover" />
              <div className="p-5">
                <h2 className="font-display text-2xl text-horizon">{course.title}</h2>
                <p className="mt-1 text-sm text-muted">{owned ? 'You own this' : `Preview free · ${formatPrice(course.priceCents)}`}</p>
                <Link href={href} className="mt-4 inline-block text-sm text-gulf-deep">
                  {owned ? 'Continue →' : 'Watch preview →'}
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {user && entitled.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-horizon">Workbooks</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {books
              .filter((book) => book.kind === 'pdf')
              .filter((book) =>
                (book.includedWith ?? []).some(
                  (sku) => sku === 'piano-bundle' || entitled.includes(sku),
                ),
              )
              .map((book) => (
                <a
                  key={book.slug}
                  href={`/api/pdfs/${book.slug}`}
                  className="rounded-full border border-gulf/30 bg-foam px-4 py-2 text-sm text-gulf-deep"
                >
                  Download {book.title}
                </a>
              ))}
          </div>
        </section>
      )}
    </main>
  )
}
