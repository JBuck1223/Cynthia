export const dynamic = 'force-dynamic'

import { AdminPage } from '@/components/admin/AdminPage'
import { createAdminClient } from '@/lib/supabase/admin'
import { courses, bundle, formatPrice } from '@/lib/catalog'

export default async function AdminHomePage() {
  const admin = createAdminClient()
  const { count: orderCount } = admin
    ? await admin.from('orders').select('*', { count: 'exact', head: true })
    : { count: 0 }
  const { count: studentCount } = admin
    ? await admin.from('profiles').select('*', { count: 'exact', head: true })
    : { count: 0 }

  return (
    <AdminPage>
      <h1 className="font-display text-3xl text-horizon">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Sarasota piano studio — orders and access.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-card-border bg-foam p-5">
          <p className="text-xs uppercase tracking-widest text-gulf">Orders</p>
          <p className="mt-2 font-display text-4xl">{orderCount ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-card-border bg-foam p-5">
          <p className="text-xs uppercase tracking-widest text-gulf">Students</p>
          <p className="mt-2 font-display text-4xl">{studentCount ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-card-border bg-foam p-5">
          <p className="text-xs uppercase tracking-widest text-gulf">Catalog</p>
          <p className="mt-2 text-sm text-horizon">
            {courses.length} courses at {formatPrice(9700)} · bundle {formatPrice(bundle.priceCents)}
          </p>
        </div>
      </div>
    </AdminPage>
  )
}
