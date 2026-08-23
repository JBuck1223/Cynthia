'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/courses', label: 'Courses' },
  { href: '/books', label: 'Books' },
  { href: '/studio', label: 'Studio' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const overlay = pathname === '/'

  return (
    <header
      className={cn(
        'z-40',
        overlay
          ? 'absolute inset-x-0 top-0 bg-gradient-to-b from-horizon/55 to-transparent'
          : 'sticky top-0 border-b border-card-border/70 bg-foam/90 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className={cn('font-display text-xl tracking-tight', overlay ? 'text-foam' : 'text-horizon')}>
            Cynthia
          </span>
          <span
            className={cn(
              'hidden text-xs uppercase tracking-[0.22em] sm:inline',
              overlay ? 'text-foam/70' : 'text-gulf',
            )}
          >
            Music
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm transition-colors',
                overlay
                  ? 'text-foam/80 hover:text-foam'
                  : pathname.startsWith(link.href)
                    ? 'text-gulf-deep'
                    : 'text-muted hover:text-horizon',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/courses"
            className={cn(
              'rounded-full px-4 py-2 text-sm transition-colors',
              overlay ? 'bg-foam text-horizon hover:bg-sand' : 'bg-gulf text-foam hover:bg-gulf-deep',
            )}
          >
            Start playing
          </Link>
        </nav>

        <button
          type="button"
          className={cn('md:hidden p-2', overlay ? 'text-foam' : 'text-horizon')}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-horizon/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1 text-foam"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
