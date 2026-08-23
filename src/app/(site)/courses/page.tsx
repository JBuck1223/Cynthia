import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { courses, bundle, formatPrice } from '@/lib/catalog'
import { BuyButton } from '@/components/site/BuyButton'

export const metadata: Metadata = { title: 'Courses' }

export default function CoursesPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-gulf">Learn piano</p>
      <h1 className="font-display mt-3 text-4xl text-horizon">Three courses. One family piano.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        $97 each, or the bundle for {formatPrice(bundle.priceCents)} — save{' '}
        {formatPrice(bundle.savingsCents)}. Watch a free preview on every course.
      </p>

      <div className="mt-8 rounded-3xl border border-gulf/20 bg-sky p-6 md:flex md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-horizon">{bundle.title}</h2>
          <p className="mt-1 text-sm text-muted">{bundle.description}</p>
        </div>
        <BuyButton sku={bundle.sku} className="mt-4 md:mt-0" label={`Bundle · ${formatPrice(bundle.priceCents)}`} />
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="overflow-hidden rounded-3xl border border-card-border bg-foam"
          >
            <Image src={course.cover} alt={course.title} width={800} height={500} className="h-48 w-full object-cover" />
            <div className="p-5">
              <h2 className="font-display text-2xl text-horizon">{course.title}</h2>
              <p className="mt-2 text-sm text-muted">{course.tagline}</p>
              <p className="mt-4 text-sm text-gulf-deep">
                {formatPrice(course.priceCents)} · {course.lessons.length} lessons
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
