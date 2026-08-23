export const dynamic = 'force-dynamic'

import { AdminPage } from '@/components/admin/AdminPage'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/catalog'

export default async function OrdersPage() {
  const admin = createAdminClient()
  const { data } = admin
    ? await admin.from('orders').select('*').order('created_at', { ascending: false }).limit(100)
    : { data: [] }

  return (
    <AdminPage>
      <h1 className="font-display text-3xl text-horizon">Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-card-border bg-foam">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-card-border text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row) => (
              <tr key={row.id} className="border-b border-card-border last:border-0">
                <td className="px-4 py-3 text-muted">{new Date(row.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{row.sku}</td>
                <td className="px-4 py-3">{formatPrice(row.amount_cents)}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={4}>
                  No orders yet. Stripe webhook will land them here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  )
}
