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
    <main className="mx-auto max-w-site px-6 py-16 md:py-20 lg:px-10">
      <p className="kicker">Your studio</p>
      <h1 className="font-display mt-5 text-4xl text-horizon md:text-5xl">
        {user ? 'Pick up where you left off.' : 'Log in to open the full courses.'}
      </h1>
      {!user && (
        <p className="mt-5 text-2xl text-muted">
          Previews are free. After you buy, we email a login link.{' '}
          <Link href="/login" className="font-semibold text-gulf-deep">
            Get a link
          </Link>
        </p>
      )}

      <div className="mt-12 grid gap-7 md:grid-cols-3">
        {courses.map((course) => {
          const owned = entitled.includes(course.slug)
          const href = `/studio/${course.slug}/${course.lessons[0].slug}`
          return (
            <article key={course.slug} className="card">
              <Image src={course.cover} alt="" width={800} height={400} className="h-48 w-full object-cover" />
              <div className="p-6">
                <h2 className="font-display text-2xl text-horizon md:text-3xl">{course.title}</h2>
                <p className="mt-2 text-xl text-muted">
                  {owned ? 'You own this' : `Preview free · ${formatPrice(course.priceCents)}`}
                </p>
                <Link href={href} className="btn-secondary mt-5">
                  {owned ? 'Continue →' : 'Watch preview →'}
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {user && entitled.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl text-horizon">Workbooks</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {books
              .filter((book) => book.kind === 'pdf')
              .filter((book) =>
                (book.includedWith ?? []).some((sku) => sku === 'piano-bundle' || entitled.includes(sku)),
              )
              .map((book) => (
                <a key={book.slug} href={`/api/pdfs/${book.slug}`} className="btn-secondary">
                  Download {book.title}
                </a>
              ))}
          </div>
        </section>
      )}
    </main>
  )
}
