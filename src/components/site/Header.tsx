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

  return (
    <header className="sticky top-0 z-40 border-b border-card-border/70 bg-foam/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl text-horizon tracking-tight">Cynthia</span>
          <span className="hidden text-xs uppercase tracking-[0.22em] text-gulf sm:inline">
            Sarasota
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm transition-colors',
                pathname.startsWith(link.href) ? 'text-gulf-deep' : 'text-muted hover:text-horizon',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/courses"
            className="rounded-full bg-gulf px-4 py-2 text-sm text-foam transition-colors hover:bg-gulf-deep"
          >
            Start playing
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden p-2 text-horizon"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-card-border bg-foam px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1 text-horizon"
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
