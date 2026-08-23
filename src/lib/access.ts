import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { courses } from '@/lib/catalog'

export async function getSessionUser() {
  const supabase = await createClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

export async function getEntitledSlugs(userId: string) {
  const admin = createAdminClient()
  if (!admin) return [] as string[]
  const { data } = await admin.from('course_entitlements').select('course_slug').eq('user_id', userId)
  return (data ?? []).map((row) => row.course_slug as string)
}

export function isEntitled(slugs: string[], courseSlug: string) {
  return slugs.includes(courseSlug)
}

export function courseBySlug(slug: string) {
  return courses.find((c) => c.slug === slug) ?? null
}
