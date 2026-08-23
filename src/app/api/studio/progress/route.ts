import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()
  if (!supabase || !admin) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const courseSlug = String(body.courseSlug || '')
  const lessonSlug = String(body.lessonSlug || '')
  if (!courseSlug || !lessonSlug) {
    return NextResponse.json({ error: 'Missing lesson' }, { status: 400 })
  }

  await admin.from('lesson_progress').upsert(
    {
      user_id: data.user.id,
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      status: 'completed',
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,course_slug,lesson_slug' },
  )

  return NextResponse.json({ ok: true })
}
