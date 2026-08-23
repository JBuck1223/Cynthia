import Image from 'next/image'
import Link from 'next/link'
import { Music2, Users, Pencil } from 'lucide-react'
import { FadeIn } from '@/components/site/FadeIn'
import { BuyButton } from '@/components/site/BuyButton'
import { SITE, books, bundle, courses, formatPrice } from '@/lib/catalog'

export default function HomePage() {
  return (
    <main>
      <section className="beach-horizon relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-16 md:grid-cols-2 md:items-center md:pb-28 md:pt-24">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.28em] text-gulf-deep">
              {SITE.city} · piano · composition
            </p>
            <h1 className="font-display mt-4 text-4xl leading-tight text-horizon md:text-6xl">
              Play together.
              <br />
              Write songs together.
            </h1>
            <p className="mt-5 max-w-md text-lg text-horizon/80">
              {SITE.promise} Cynthia Jordan — writer of the #1 country song{' '}
              <em>José Cuervo</em> — teaches the numbers behind the music.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BuyButton sku={bundle.sku} label={`Get the family bundle · ${formatPrice(bundle.priceCents)}`} />
              <Link
                href="/courses"
                className="inline-flex items-center rounded-full border border-horizon/15 bg-foam/70 px-5 py-2.5 text-sm text-horizon hover:bg-foam"
              >
                See the courses
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={120} className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-foam/60 shadow-2xl shadow-gulf-deep/10">
              <Image
                src="/images/cynthia/speaking.jpg"
                alt="Cynthia Jordan teaching"
                width={900}
                height={1100}
                className="h-[420px] w-full object-cover md:h-[520px]"
                priority
              />
            </div>
            <p className="mt-3 text-sm text-gulf-deep">Cynthia Jordan · {SITE.tagline}</p>
          </FadeIn>
        </div>
        <div className="wave-line mx-auto max-w-6xl" />
      </section>

      <section className="bg-sand py-20">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gulf">Who it is for</p>
            <h2 className="font-display mt-3 text-3xl text-horizon md:text-4xl">
              Kids, adults, and the grandparent who always meant to learn.
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'The family bench',
                body: 'Sit a child next to you. The method is letters, numbers, and patterns — not years of drills.',
              },
              {
                icon: Music2,
                title: 'Play songs you love',
                body: 'Find a scale, build the chords, play the song. That is the whole trick.',
              },
              {
                icon: Pencil,
                title: 'Write your own',
                body: 'Music is Numbers is how Cynthia composes. You leave able to write, not just copy.',
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-card-border bg-foam p-6">
                  <item.icon className="h-6 w-6 text-gulf" />
                  <h3 className="mt-4 font-display text-xl text-horizon">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sky py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.28em] text-gulf">Video courses</p>
              <h2 className="font-display mt-3 text-3xl text-horizon md:text-4xl">$97 each. Bundle for $197.</h2>
            </FadeIn>
            <FadeIn>
              <BuyButton sku={bundle.sku} label={`Bundle · save ${formatPrice(bundle.savingsCents)}`} />
            </FadeIn>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {courses.map((course, i) => (
              <FadeIn key={course.slug} delay={i * 80}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-card-border bg-foam"
                >
                  <Image
                    src={course.cover}
                    alt={course.title}
                    width={800}
                    height={500}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-gulf">{course.who}</p>
                    <h3 className="font-display mt-2 text-2xl text-horizon">{course.title}</h3>
                    <p className="mt-2 text-sm text-muted">{course.tagline}</p>
                    <p className="mt-4 text-sm text-gulf-deep">{formatPrice(course.priceCents)}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.28em] text-gulf">Books</p>
            <h2 className="font-display mt-3 text-3xl text-horizon">Workbooks on the bench. Paperbacks on Amazon.</h2>
          </FadeIn>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book, i) => (
              <FadeIn key={book.slug} delay={i * 60}>
                <div className="overflow-hidden rounded-3xl border border-card-border bg-foam">
                  {book.cover ? (
                    <Image
                      src={book.cover}
                      alt={book.title}
                      width={600}
                      height={800}
                      className="h-64 w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-64 items-end bg-sky p-5">
                      <p className="font-display text-xl text-gulf-deep">{book.title}</p>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-display text-lg text-horizon">{book.title}</h3>
                    <p className="mt-1 text-xs text-muted">
                      {book.kind === 'pdf' ? 'PDF with the matching course' : 'Paperback on Amazon'}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/books" className="text-sm text-gulf-deep hover:text-gulf">
              All books →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
