'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/site/Logo'

const links = [
  { href: '/courses', label: 'Courses' },
  { href: '/books', label: 'Books' },
  { href: '/studio', label: 'Studio' },
]

export function SiteNav({ light }: { light?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="mx-auto flex min-h-20 max-w-site items-center justify-between px-6 py-3 lg:px-10">
        <Link href="/" aria-label="Cynthia Music home">
          <Logo inverted={light} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-full px-5 py-3 text-lg transition-colors',
                light
                  ? 'text-foam/90 hover:bg-foam/15 hover:text-foam'
                  : pathname.startsWith(link.href)
                    ? 'bg-sky text-gulf-deep'
                    : 'text-muted hover:bg-sky/70 hover:text-horizon',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/courses"
            className="btn ml-2 bg-coral text-foam shadow-[0_12px_28px_-12px_rgba(255,122,92,0.9)] hover:bg-coral-deep"
          >
            Start playing
          </Link>
        </nav>

        <button
          type="button"
          className={cn('rounded-full p-3 md:hidden', light ? 'text-foam' : 'text-horizon')}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div
          className={cn(
            'px-5 py-5 md:hidden',
            light ? 'border-t border-foam/15 bg-horizon/90' : 'border-t border-gulf/10 bg-foam/95',
          )}
        >
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-2xl px-4 py-3 text-lg',
                  light ? 'text-foam hover:bg-foam/10' : 'text-horizon hover:bg-sky',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/courses"
              onClick={() => setOpen(false)}
              className="btn mt-2 bg-coral text-center text-foam"
            >
              Start playing
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  if (pathname === '/') return null

  return (
    <header className="sticky top-0 z-40 border-b border-gulf/10 bg-foam/80 backdrop-blur-xl">
      <SiteNav />
    </header>
  )
}
