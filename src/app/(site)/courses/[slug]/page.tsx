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
    <main className="mx-auto max-w-site px-6 py-16 md:py-20 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="kicker">{course.who}</p>
          <h1 className="font-display mt-5 text-4xl text-horizon md:text-6xl">{course.title}</h1>
          <p className="mt-5 text-2xl text-horizon/80">{course.tagline}</p>
          <p className="mt-5 max-w-xl text-2xl leading-relaxed text-muted">{course.description}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <BuyButton sku={course.sku} label={`Buy this course · ${formatPrice(course.priceCents)}`} />
            <BuyButton sku="piano-bundle" label="Get the bundle" className="bg-gulf hover:bg-gulf-deep" />
          </div>
        </div>
        <Image
          src={course.cover}
          alt={course.title}
          width={900}
          height={600}
          className="w-full rounded-[2.25rem] object-cover shadow-[0_24px_60px_-28px_rgba(14,138,156,0.45)]"
        />
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-horizon">Free preview</h2>
        <div className="card mt-5 overflow-hidden bg-horizon">
          <VimeoPlayer lesson={preview} />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-horizon">Lessons</h2>
        <ol className="card mt-6 divide-y divide-card-border">
          {course.lessons.map((lesson, i) => (
            <li key={lesson.slug} className="flex items-center justify-between gap-4 px-6 py-5">
              <div>
                <p className="text-base text-muted">{String(i + 1).padStart(2, '0')}</p>
                <p className="text-lg text-horizon">{lesson.title}</p>
              </div>
              {lesson.isPreview ? (
                <Link href={`/studio/${course.slug}/${lesson.slug}`} className="btn-secondary px-5 py-3 text-base">
                  Watch free
                </Link>
              ) : (
                <span className="text-base text-muted">Included</span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
