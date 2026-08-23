import Image from 'next/image'
import type { Metadata } from 'next'
import { books } from '@/lib/catalog'
import { BuyButton } from '@/components/site/BuyButton'

export const metadata: Metadata = { title: 'Books' }

export default function BooksPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-gulf">Workbooks</p>
      <h1 className="font-display mt-3 text-4xl text-horizon">Put a book on the bench.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Digital PDFs come with the matching course. Paperbacks ship from Amazon — good for kids, gifts, and
        grandparents who like paper.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {books.map((book) => (
          <article key={book.slug} className="grid gap-5 overflow-hidden rounded-3xl border border-card-border bg-foam sm:grid-cols-[180px_1fr]">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={book.title}
                  width={360}
                  height={480}
                  className="h-56 w-full object-cover object-top sm:h-full"
                />
              ) : (
                <div className="flex h-56 items-center bg-sky px-6 sm:h-full">
                  <p className="font-display text-2xl text-gulf-deep">{book.title}</p>
                </div>
              )}
            <div className="p-5">
              <h2 className="font-display text-2xl text-horizon">{book.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{book.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {book.kind === 'pdf' && book.includedWith?.includes('one-hour-piano') && (
                  <BuyButton sku="one-hour-piano" label="Get with One Hour Piano" />
                )}
                {book.kind === 'pdf' && book.includedWith?.includes('music-is-numbers') && (
                  <BuyButton sku="music-is-numbers" label="Get with Music is Numbers" />
                )}
                {book.amazonUrl && (
                  <a
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-horizon/15 px-5 py-2.5 text-sm text-horizon hover:bg-sand"
                  >
                    Paperback on Amazon
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
