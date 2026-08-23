'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    try {
      const supabase = createClient()
      const origin = window.location.origin
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${origin}/auth/callback?next=/studio` },
      })
      if (error) throw error
      setState('sent')
    } catch (err) {
      setState('error')
      setMessage(
        err instanceof Error
          ? err.message
          : 'Could not send the link. Add Supabase keys to enable login.',
      )
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-24">
      <p className="text-xs uppercase tracking-[0.28em] text-gulf">Studio login</p>
      <h1 className="font-display mt-3 text-3xl text-horizon">A link, not a password.</h1>
      <p className="mt-3 text-muted">We email you a sign-in link. Use the address you bought with.</p>

      {state === 'sent' ? (
        <p className="mt-8 rounded-3xl border border-gulf/20 bg-sky p-6 text-gulf-deep">
          Check {email}. The link opens your studio.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-card-border bg-foam p-6">
          <label className="block text-sm text-horizon">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-card-border bg-sand px-3 py-2.5 outline-none focus:border-gulf"
            />
          </label>
          {state === 'error' && <p className="text-sm text-coral-deep">{message}</p>}
          <button
            type="submit"
            disabled={state === 'sending'}
            className="w-full rounded-full bg-gulf py-3 text-sm text-foam hover:bg-gulf-deep disabled:opacity-60"
          >
            {state === 'sending' ? 'Sending…' : 'Email me a link'}
          </button>
        </form>
      )}
    </main>
  )
}
