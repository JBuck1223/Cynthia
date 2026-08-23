import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { courses, bundle, formatPrice } from '@/lib/catalog'
import { BuyButton } from '@/components/site/BuyButton'

export const metadata: Metadata = { title: 'Courses' }

export default function CoursesPage() {
  return (
    <main className="mx-auto max-w-site px-6 py-16 md:py-20 lg:px-10">
      <p className="kicker">Learn piano</p>
      <h1 className="font-display mt-5 text-5xl text-horizon md:text-6xl">Three courses. One family piano.</h1>
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
            <h2 className="font-display text-3xl text-horizon">{bundle.title}</h2>
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
              <h2 className="font-display text-2xl text-horizon md:text-3xl">{course.title}</h2>
              <p className="mt-2 text-xl text-muted">{course.tagline}</p>
              <p className="mt-4 text-lg font-semibold text-gulf-deep">
                {formatPrice(course.priceCents)} · {course.lessons.length} lessons
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
