import Image from 'next/image'
import type { Metadata } from 'next'
import { books } from '@/lib/catalog'
import { BuyButton } from '@/components/site/BuyButton'

export const metadata: Metadata = { title: 'Books' }

export default function BooksPage() {
  return (
    <main className="mx-auto max-w-site px-6 py-16 md:py-20 lg:px-10">
      <p className="kicker">Workbooks</p>
      <h1 className="font-display mt-5 text-4xl text-horizon md:text-6xl">Put a book on the bench.</h1>
      <p className="mt-5 max-w-2xl text-2xl text-muted">
        Digital PDFs come with the matching course. Paperbacks ship from Amazon — good for kids, gifts, and
        grandparents who like paper.
      </p>
      <div className="mt-12 grid gap-7 md:grid-cols-2">
        {books.map((book) => (
          <article key={book.slug} className="card grid gap-0 sm:grid-cols-[220px_1fr]">
            <div className="p-4 sm:pr-0 sm:py-4 sm:pl-4">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={book.title}
                  width={360}
                  height={480}
                  className="h-64 w-full rounded-[1.5rem] object-cover object-top sm:h-full"
                />
              ) : (
                <div className="flex h-64 items-center rounded-[1.5rem] bg-sky px-6 sm:h-full">
                  <p className="font-display text-2xl text-gulf-deep">{book.title}</p>
                </div>
              )}
            </div>
            <div className="p-6 md:p-8">
              <h2 className="font-display text-3xl text-horizon">{book.title}</h2>
              <p className="mt-3 text-xl leading-relaxed text-muted">{book.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {book.kind === 'pdf' && book.includedWith?.includes('one-hour-piano') && (
                  <BuyButton sku="one-hour-piano" label="Get with One Hour Piano" />
                )}
                {book.kind === 'pdf' && book.includedWith?.includes('music-is-numbers') && (
                  <BuyButton sku="music-is-numbers" label="Get with Music is Numbers" />
                )}
                {book.amazonUrl && (
                  <a href={book.amazonUrl} target="_blank" rel="noreferrer" className="btn-secondary">
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
