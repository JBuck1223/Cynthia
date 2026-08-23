import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const { auth_user_id } = await request.json().catch(() => ({ auth_user_id: null }))
  if (!auth_user_id) return NextResponse.json({ staff: null })

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ staff: null })

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('auth_user_id', auth_user_id)
    .eq('is_active', true)
    .single()

  if (error || !data) return NextResponse.json({ staff: null })
  return NextResponse.json({
    staff: {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
    },
  })
}
