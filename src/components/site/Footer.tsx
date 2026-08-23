import Link from 'next/link'
import { SITE } from '@/lib/catalog'
import { Logo } from '@/components/site/Logo'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gulf/10 bg-sky/70 text-horizon">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gulf-light/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-peach/80 blur-3xl" />
      <div className="relative mx-auto flex max-w-site flex-col gap-10 px-6 py-16 md:flex-row md:items-end md:justify-between lg:px-10">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-base text-muted">
            {SITE.tagline}. Piano and composition from {SITE.city}.
          </p>
        </div>
        <div className="flex flex-wrap gap-7 text-base">
          <Link href="/courses" className="hover:text-gulf-deep">
            Courses
          </Link>
          <Link href="/books" className="hover:text-gulf-deep">
            Books
          </Link>
          <Link href="/studio" className="hover:text-gulf-deep">
            Studio
          </Link>
          <a href={`mailto:${SITE.email}`} className="hover:text-gulf-deep">
            {SITE.email}
          </a>
        </div>
        <p className="text-base text-muted">© {new Date().getFullYear()} Cynthia Music</p>
      </div>
    </footer>
  )
}
