import Image from 'next/image'
import Link from 'next/link'
import { FadeIn } from '@/components/site/FadeIn'
import { BuyButton } from '@/components/site/BuyButton'
import { SiteNav } from '@/components/site/Header'
import { SITE, bundle, courses, formatPrice } from '@/lib/catalog'

export default function HomePage() {
  return (
    <main>
      <header className="relative min-h-screen overflow-hidden bg-horizon">
        <Image
          src="/images/cynthia/hero.jpg"
          alt="Cynthia Jordan with guitar on the Sarasota shore"
          fill
          priority
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-horizon/70 via-horizon/35 to-transparent" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteNav light />
          <div className="mx-auto flex w-full max-w-site flex-1 items-end px-6 pb-16 md:items-center md:pb-24 lg:px-10">
            <FadeIn className="max-w-2xl text-foam">
              <p className="inline-flex rounded-full bg-foam/15 px-4 py-2 text-base font-semibold text-foam backdrop-blur-sm">
                {SITE.city}
              </p>
              <h1 className="font-display mt-6 text-5xl leading-[1.05] md:text-7xl">
                Play together.
                <br />
                Write songs together.
              </h1>
              <p className="mt-6 max-w-xl text-2xl leading-relaxed text-foam/90">
                {SITE.promise} Cynthia Jordan — writer of the #1 country song <em>José Cuervo</em> — teaches
                the numbers behind the music.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <BuyButton sku={bundle.sku} label={`Family bundle · ${formatPrice(bundle.priceCents)}`} />
                <Link
                  href="/courses"
                  className="btn border border-foam/50 bg-foam/10 text-foam backdrop-blur-sm hover:bg-foam/20"
                >
                  See the courses
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-site px-6 py-16 md:py-20 lg:px-10">
        <p className="kicker">Learn piano</p>
        <h2 className="font-display mt-5 text-5xl text-horizon md:text-6xl">Three courses. One family piano.</h2>
        <p className="mt-5 max-w-2xl text-2xl text-muted">
          $97 each, or the bundle for {formatPrice(bundle.priceCents)} — save {formatPrice(bundle.savingsCents)}.
          Watch a free preview on every course.
        </p>

        <div className="card mt-12 overflow-hidden md:grid md:grid-cols-[280px_1fr]">
          <Image
            src="/images/courses/piano-bundle.jpg"
            alt={bundle.title}
            width={560}
            height={420}
            className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full"
          />
          <div className="flex flex-col justify-center gap-6 p-7 md:flex-row md:items-center md:justify-between md:p-9">
            <div>
              <h3 className="font-display text-3xl text-horizon">{bundle.title}</h3>
              <p className="mt-2 max-w-xl text-xl text-muted">{bundle.description}</p>
            </div>
            <BuyButton sku={bundle.sku} label={`Bundle · ${formatPrice(bundle.priceCents)}`} />
          </div>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.slug} href={`/courses/${course.slug}`} className="card card-hover group block">
              <Image
                src={course.cover}
                alt={course.title}
                width={800}
                height={500}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-6">
                <h3 className="font-display text-2xl text-horizon md:text-3xl">{course.title}</h3>
                <p className="mt-2 text-xl text-muted">{course.tagline}</p>
                <p className="mt-4 text-lg font-semibold text-gulf-deep">
                  {formatPrice(course.priceCents)} · {course.lessons.length} lessons
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:py-24 lg:px-10">
        <div className="card mx-auto grid max-w-site items-center gap-10 p-6 md:grid-cols-2 md:gap-14 md:p-10">
          <FadeIn>
            <Image
              src="/images/cynthia/portrait.jpg"
              alt="Cynthia Jordan"
              width={800}
              height={1100}
              className="w-full rounded-[2rem] object-cover"
            />
          </FadeIn>
          <FadeIn delay={80}>
            <p className="kicker">The teacher</p>
            <h2 className="font-display mt-5 text-4xl text-horizon md:text-5xl">Cynthia Jordan</h2>
            <p className="mt-6 text-2xl leading-relaxed text-muted">
              Billboard #1 songwriter. Piano teacher. Grandparent who still sits at the bench. The method is
              letters, numbers, and patterns — so a child and an adult can learn the same song the same night.
            </p>
            <p className="mt-4 text-2xl leading-relaxed text-muted">
              These courses were filmed for families in Sarasota and anywhere a piano lives.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="px-6 py-8 md:py-16 lg:px-10">
        <div className="mx-auto max-w-site">
          <FadeIn className="max-w-2xl">
            <p className="kicker">Who it is for</p>
            <h2 className="font-display mt-5 text-4xl text-horizon md:text-5xl">
              Kids, adults, grandparents. One bench.
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
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
              <FadeIn key={item.title} delay={i * 80} className="card card-hover">
                <Image
                  src={item.photo}
                  alt=""
                  width={700}
                  height={900}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl text-horizon md:text-3xl">{item.title}</h3>
                  <p className="mt-3 text-xl leading-relaxed text-muted">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-8 md:py-12 lg:px-10">
        <div className="relative mx-auto max-w-site overflow-hidden rounded-[2.25rem] bg-gulf-deep px-6 py-16 text-center text-foam md:px-16 md:py-20">
          <Image src="/images/cynthia/sunset.jpg" alt="" fill className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-br from-gulf-deep/70 via-gulf/50 to-coral/40" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <p className="inline-flex rounded-full bg-foam/20 px-4 py-2 text-base font-semibold text-foam">
              {SITE.city.split(',')[0]}
            </p>
            <h2 className="font-display mt-6 text-4xl md:text-6xl">{SITE.tagline}</h2>
            <p className="mt-5 text-2xl text-foam/90">
              All three courses, both workbooks, one price. Sit down tonight.
            </p>
            <div className="mt-9">
              <BuyButton sku={bundle.sku} label={`Get the family bundle · ${formatPrice(bundle.priceCents)}`} />
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
