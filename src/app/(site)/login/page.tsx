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
    <main className="mx-auto max-w-lg px-5 py-20 md:py-28">
      <p className="kicker">Studio login</p>
      <h1 className="font-display mt-5 text-4xl text-horizon md:text-5xl">A link, not a password.</h1>
      <p className="mt-4 text-2xl text-muted">We email you a sign-in link. Use the address you bought with.</p>

      {state === 'sent' ? (
        <p className="card mt-10 bg-sky p-8 text-lg text-gulf-deep">
          Check {email}. The link opens your studio.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="card mt-10 space-y-5 p-8">
          <label className="block text-base text-horizon">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-card-border bg-sand px-4 py-3.5 outline-none focus:border-gulf"
            />
          </label>
          {state === 'error' && <p className="text-base text-coral-deep">{message}</p>}
          <button type="submit" disabled={state === 'sending'} className="btn w-full bg-gulf text-foam hover:bg-gulf-deep disabled:opacity-60">
            {state === 'sending' ? 'Sending…' : 'Email me a link'}
          </button>
        </form>
      )}
    </main>
  )
}
