'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(authError.message)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Authentication failed')
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
        setError('You do not have admin access')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-3xl border border-card-border bg-foam p-6">
        <h1 className="font-display text-2xl text-horizon">Admin</h1>
        <p className="mt-1 text-sm text-muted">Cynthia Productions</p>
        <label className="mt-6 block text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-sand px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-sand px-3 py-2"
          />
        </label>
        {error && <p className="mt-3 text-sm text-coral-deep">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-gulf py-2.5 text-sm text-foam hover:bg-gulf-deep"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
