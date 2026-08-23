'use client'

import { useState } from 'react'

export function MarkComplete({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const [done, setDone] = useState(false)

  async function mark() {
    const res = await fetch('/api/studio/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseSlug, lessonSlug, status: 'completed' }),
    })
    if (res.ok) setDone(true)
  }

  return (
    <button
      type="button"
      onClick={mark}
      disabled={done}
      className="mt-4 rounded-full border border-gulf/30 px-4 py-2 text-sm text-gulf-deep hover:bg-sky disabled:opacity-60"
    >
      {done ? 'Marked complete' : 'Mark lesson complete'}
    </button>
  )
}
