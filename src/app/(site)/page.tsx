import Image from 'next/image'
import Link from 'next/link'
import { FadeIn } from '@/components/site/FadeIn'
import { BuyButton } from '@/components/site/BuyButton'
import { SITE, books, bundle, courses, formatPrice } from '@/lib/catalog'

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[92vh] overflow-hidden bg-horizon">
        <Image
          src="/images/cynthia/hero.jpg"
          alt="Cynthia Jordan with guitar on the Sarasota shore"
          fill
          priority
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-horizon/80 via-horizon/45 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl items-end px-5 pb-16 pt-28 md:items-center md:pb-24">
          <FadeIn className="max-w-xl text-foam">
            <p className="text-xs uppercase tracking-[0.32em] text-foam/70">{SITE.city}</p>
            <h1 className="font-display mt-4 text-5xl leading-[1.05] md:text-7xl">
              Play together.
              <br />
              Write songs together.
            </h1>
            <p className="mt-6 max-w-md text-lg text-foam/85">
              {SITE.promise} Cynthia Jordan — writer of the #1 country song <em>José Cuervo</em> — teaches the
              numbers behind the music.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BuyButton sku={bundle.sku} label={`Family bundle · ${formatPrice(bundle.priceCents)}`} />
              <Link
                href="/courses"
                className="inline-flex items-center rounded-full border border-foam/40 px-5 py-2.5 text-sm text-foam hover:bg-foam/10"
              >
                See the courses
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-foam py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <FadeIn>
            <Image
              src="/images/cynthia/portrait.jpg"
              alt="Cynthia Jordan"
              width={800}
              height={1100}
              className="w-full object-cover"
            />
          </FadeIn>
          <FadeIn delay={80}>
            <p className="text-xs uppercase tracking-[0.28em] text-gulf">The teacher</p>
            <h2 className="font-display mt-3 text-4xl text-horizon md:text-5xl">Cynthia Jordan</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Billboard #1 songwriter. Piano teacher. Grandparent who still sits at the bench. The method is
              letters, numbers, and patterns — so a child and an adult can learn the same song the same night.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              These courses were filmed for families in Sarasota and anywhere a piano lives.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gulf">Who it is for</p>
            <h2 className="font-display mt-3 text-4xl text-horizon">Kids, adults, grandparents. One bench.</h2>
          </FadeIn>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                photo: '/images/cynthia/teach.jpg',
                title: 'The family bench',
                body: 'Sit a child next to you. No years of drills. Letters and numbers first.',
              },
              {
                photo: '/images/cynthia/guitar.jpg',
                title: 'Play songs you love',
                body: 'Find a scale, build the chords, play the song. That is the whole trick.',
              },
              {
                photo: '/images/cynthia/shore.jpg',
                title: 'Write your own',
                body: 'Music is Numbers is how Cynthia composes. You leave able to write, not just copy.',
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 80}>
                <Image
                  src={item.photo}
                  alt=""
                  width={700}
                  height={900}
                  className="aspect-[3/4] w-full object-cover"
                />
                <h3 className="font-display mt-5 text-2xl text-horizon">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foam py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.28em] text-gulf">Video courses</p>
              <h2 className="font-display mt-3 text-4xl text-horizon">$97 each. Bundle $197.</h2>
            </FadeIn>
            <FadeIn>
              <BuyButton sku={bundle.sku} label={`Bundle · save ${formatPrice(bundle.savingsCents)}`} />
            </FadeIn>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {courses.map((course, i) => (
              <FadeIn key={course.slug} delay={i * 80}>
                <Link href={`/courses/${course.slug}`} className="group block">
                  <Image
                    src={course.cover}
                    alt={course.title}
                    width={800}
                    height={500}
                    className="aspect-[4/3] w-full object-cover transition-opacity group-hover:opacity-90"
                  />
                  <p className="mt-4 text-xs uppercase tracking-widest text-gulf">{course.who}</p>
                  <h3 className="font-display mt-1 text-2xl text-horizon">{course.title}</h3>
                  <p className="mt-1 text-sm text-muted">{course.tagline}</p>
                  <p className="mt-3 text-sm text-gulf-deep">{formatPrice(course.priceCents)}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-horizon py-28">
        <Image
          src="/images/cynthia/sunset.jpg"
          alt=""
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-horizon/40" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center text-foam">
          <p className="text-xs uppercase tracking-[0.32em] text-foam/70">Sarasota</p>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">{SITE.tagline}</h2>
          <p className="mt-4 text-lg text-foam/80">
            All three courses, both workbooks, one price. Sit down tonight.
          </p>
          <div className="mt-8">
            <BuyButton sku={bundle.sku} label={`Get the family bundle · ${formatPrice(bundle.priceCents)}`} />
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.28em] text-gulf">Books</p>
            <h2 className="font-display mt-3 text-4xl text-horizon">On the bench. On Amazon.</h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book, i) => (
              <FadeIn key={book.slug} delay={i * 60}>
                <Link href="/books" className="block">
                  {book.cover ? (
                    <Image
                      src={book.cover}
                      alt={book.title}
                      width={600}
                      height={800}
                      className="aspect-[3/4] w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-end bg-sky p-5">
                      <p className="font-display text-xl text-gulf-deep">{book.title}</p>
                    </div>
                  )}
                  <h3 className="font-display mt-4 text-lg text-horizon">{book.title}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {book.kind === 'pdf' ? 'PDF with the matching course' : 'Paperback on Amazon'}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
