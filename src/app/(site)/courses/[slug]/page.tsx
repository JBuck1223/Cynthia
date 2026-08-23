import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BuyButton } from '@/components/site/BuyButton'
import { VimeoPlayer } from '@/components/site/VimeoPlayer'
import { courses, formatPrice, getCourse } from '@/lib/catalog'

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }))
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const course = getCourse(slug)
    return { title: course?.title ?? 'Course' }
  })
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) notFound()
  const preview = course.lessons.find((l) => l.isPreview) ?? course.lessons[0]

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gulf">{course.who}</p>
          <h1 className="font-display mt-3 text-4xl text-horizon md:text-5xl">{course.title}</h1>
          <p className="mt-4 text-lg text-horizon/80">{course.tagline}</p>
          <p className="mt-4 max-w-xl text-muted leading-relaxed">{course.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BuyButton sku={course.sku} label={`Buy this course · ${formatPrice(course.priceCents)}`} />
            <BuyButton sku="piano-bundle" label="Get the bundle" className="bg-gulf hover:bg-gulf-deep" />
          </div>
        </div>
        <Image
          src={course.cover}
          alt={course.title}
          width={900}
          height={600}
          className="w-full rounded-3xl border border-card-border object-cover"
        />
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-horizon">Free preview</h2>
        <div className="mt-4 overflow-hidden rounded-3xl border border-card-border bg-horizon">
          <VimeoPlayer lesson={preview} />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-horizon">Lessons</h2>
        <ol className="mt-6 divide-y divide-card-border overflow-hidden rounded-3xl border border-card-border bg-foam">
          {course.lessons.map((lesson, i) => (
            <li key={lesson.slug} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm text-muted">{String(i + 1).padStart(2, '0')}</p>
                <p className="text-horizon">{lesson.title}</p>
              </div>
              {lesson.isPreview ? (
                <Link href={`/studio/${course.slug}/${lesson.slug}`} className="text-sm text-gulf">
                  Watch free
                </Link>
              ) : (
                <span className="text-sm text-muted">Included</span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
