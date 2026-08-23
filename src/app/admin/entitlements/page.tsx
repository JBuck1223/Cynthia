export const dynamic = 'force-dynamic'

import { AdminPage } from '@/components/admin/AdminPage'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function EntitlementsPage() {
  const admin = createAdminClient()
  const { data } = admin
    ? await admin
        .from('course_entitlements')
        .select('id, course_slug, created_at, user_id, profiles(email)')
        .order('created_at', { ascending: false })
        .limit(200)
    : { data: [] }

  return (
    <AdminPage>
      <h1 className="font-display text-3xl text-horizon">Access</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-card-border bg-foam">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-card-border text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Granted</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row) => {
              const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
              return (
                <tr key={row.id} className="border-b border-card-border last:border-0">
                  <td className="px-4 py-3">{profile?.email ?? row.user_id}</td>
                  <td className="px-4 py-3">{row.course_slug}</td>
                  <td className="px-4 py-3 text-muted">{new Date(row.created_at).toLocaleString()}</td>
                </tr>
              )
            })}
            {(!data || data.length === 0) && (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={3}>
                  No entitlements yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  )
}
