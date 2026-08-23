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
    <main className="mx-auto max-w-site px-6 py-12 md:py-16 lg:px-10">
      <p className="kicker">
        <Link href="/studio">{course.title}</Link>
      </p>
      <h1 className="font-display mt-5 text-4xl text-horizon md:text-5xl">{lesson.title}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
        <div>
          {canWatch ? (
            <div className="card overflow-hidden">
              <VimeoPlayer lesson={lesson} title={lesson.title} />
            </div>
          ) : (
            <div className="card flex aspect-video flex-col items-center justify-center bg-sky px-8 text-center">
              <p className="font-display text-3xl text-horizon">This lesson is inside the course.</p>
              <p className="mt-3 text-lg text-muted">Buy once. Watch anytime. Sit down with a kid tonight.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <BuyButton sku={course.sku} />
                {!user && (
                  <Link href="/login" className="btn-secondary">
                    I already bought this
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="mt-5 flex justify-between text-base">
            {prev ? (
              <Link href={`/studio/${course.slug}/${prev.slug}`} className="font-medium text-gulf-deep">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/studio/${course.slug}/${next.slug}`} className="font-medium text-gulf-deep">
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
          <ol className="card">
            {course.lessons.map((item, i) => {
              const locked = !item.isPreview && !owned
              return (
                <li key={item.slug} className="border-b border-card-border last:border-0">
                  <Link
                    href={`/studio/${course.slug}/${item.slug}`}
                    className={`block px-5 py-4 text-base ${
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
            <div className="card max-h-[28rem] overflow-y-auto p-6">
              <h2 className="kicker">Transcript</h2>
              {transcript.cues?.length ? (
                <div className="mt-4 space-y-3 text-base leading-relaxed text-horizon/90">
                  {transcript.cues.map((cue) => (
                    <p key={`${cue.start}-${cue.text}`}>{cue.text}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-horizon/90">{transcript.text}</p>
              )}
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}
