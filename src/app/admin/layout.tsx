'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutGrid, ShoppingBag, KeyRound, LogOut, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/admin', name: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/orders', name: 'Orders', icon: ShoppingBag },
  { href: '/admin/entitlements', name: 'Access', icon: KeyRound },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLogin = pathname.replace(/\/+$/, '') === '/admin/login'
  const [ready, setReady] = useState(isLogin)
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    if (isLogin) {
      setReady(true)
      return
    }
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace('/admin/login')
        return
      }
      const verify = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth_user_id: user.id }),
      })
      const { staff } = await verify.json()
      if (!staff) {
        await supabase.auth.signOut()
        router.replace('/admin/login')
        return
      }
      setName(staff.full_name)
      setReady(true)
    })
  }, [isLogin, router])

  if (isLogin) return <>{children}</>
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand">
        <p className="text-sm text-muted">Loading admin…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-sand">
      <aside className="hidden w-52 flex-col border-r border-card-border bg-foam md:flex">
        <div className="border-b border-card-border px-4 py-4">
          <p className="font-display text-horizon">Cynthia Admin</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-2 text-sm',
                  active ? 'bg-sky text-gulf-deep' : 'text-muted hover:bg-sand',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="space-y-1 border-t border-card-border p-3 text-xs text-muted">
          {name && <p className="px-2">{name}</p>}
          <Link href="/" className="flex items-center gap-2 px-2 py-1 hover:text-horizon">
            <ExternalLink className="h-3.5 w-3.5" /> Site
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-2 py-1 hover:text-coral-deep"
            onClick={async () => {
              await createClient().auth.signOut()
              router.replace('/admin/login')
            }}
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
