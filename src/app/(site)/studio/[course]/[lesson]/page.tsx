export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEntitledSlugs, getSessionUser } from '@/lib/access'
import { getLesson } from '@/lib/catalog'
import { loadTranscript } from '@/lib/transcripts'
import { VimeoPlayer } from '@/components/site/VimeoPlayer'
import { BuyButton } from '@/components/site/BuyButton'
import { MarkComplete } from '@/components/site/MarkComplete'


export default async function LessonPage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>
}) {
  const { course: courseSlug, lesson: lessonSlug } = await params
  const found = getLesson(courseSlug, lessonSlug)
  if (!found) notFound()
  const { course, lesson } = found

  const user = await getSessionUser()
  const entitled = user ? await getEntitledSlugs(user.id) : []
  const owned = entitled.includes(course.slug)
  const canWatch = lesson.isPreview || owned
  const transcript = canWatch ? await loadTranscript(course.slug, lesson.slug) : null

  const index = course.lessons.findIndex((l) => l.slug === lesson.slug)
  const prev = course.lessons[index - 1]
  const next = course.lessons[index + 1]

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.28em] text-gulf">
        <Link href="/studio">{course.title}</Link>
      </p>
      <h1 className="font-display mt-2 text-3xl text-horizon">{lesson.title}</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
        <div>
          {canWatch ? (
            <div className="overflow-hidden rounded-3xl border border-card-border">
              <VimeoPlayer lesson={lesson} title={lesson.title} />
            </div>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center rounded-3xl border border-card-border bg-sky px-6 text-center">
              <p className="font-display text-2xl text-horizon">This lesson is inside the course.</p>
              <p className="mt-2 text-sm text-muted">Buy once. Watch anytime. Sit down with a kid tonight.</p>
              <div className="mt-6 flex gap-3">
                <BuyButton sku={course.sku} />
                {!user && (
                  <Link href="/login" className="rounded-full border border-horizon/15 px-5 py-2.5 text-sm">
                    I already bought this
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-between text-sm">
            {prev ? (
              <Link href={`/studio/${course.slug}/${prev.slug}`} className="text-gulf">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/studio/${course.slug}/${next.slug}`} className="text-gulf">
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
          {canWatch && owned && user && (
            <MarkComplete courseSlug={course.slug} lessonSlug={lesson.slug} />
          )}
        </div>

        <aside className="space-y-6">
          <ol className="overflow-hidden rounded-3xl border border-card-border bg-foam">
            {course.lessons.map((item, i) => {
              const locked = !item.isPreview && !owned
              return (
                <li key={item.slug} className="border-b border-card-border last:border-0">
                  <Link
                    href={`/studio/${course.slug}/${item.slug}`}
                    className={`block px-4 py-3 text-sm ${
                      item.slug === lesson.slug ? 'bg-sky text-gulf-deep' : 'text-horizon hover:bg-sand'
                    }`}
                  >
                    <span className="text-muted">{String(i + 1).padStart(2, '0')} · </span>
                    {item.title}
                    {locked ? ' · locked' : item.isPreview ? ' · preview' : ''}
                  </Link>
                </li>
              )
            })}
          </ol>

          {transcript?.text && (
            <div className="max-h-[28rem] overflow-y-auto rounded-3xl border border-card-border bg-foam p-5">
              <h2 className="text-xs uppercase tracking-[0.2em] text-gulf">Transcript</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-horizon/90">{transcript.text}</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}
