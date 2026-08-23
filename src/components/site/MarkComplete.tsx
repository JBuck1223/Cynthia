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
    <button type="button" onClick={mark} disabled={done} className="btn-secondary mt-5 disabled:opacity-60">
      {done ? 'Marked complete' : 'Mark lesson complete'}
    </button>
  )
}
