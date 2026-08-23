import Link from 'next/link'
import { SITE } from '@/lib/catalog'

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-foam">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg text-horizon">Cynthia Productions</p>
          <p className="mt-1 text-sm text-muted">
            {SITE.tagline}. {SITE.city}.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-muted">
          <Link href="/courses" className="hover:text-horizon">
            Courses
          </Link>
          <Link href="/books" className="hover:text-horizon">
            Books
          </Link>
          <Link href="/studio" className="hover:text-horizon">
            Studio
          </Link>
          <a href={`mailto:${SITE.email}`} className="hover:text-horizon">
            {SITE.email}
          </a>
        </div>
        <p className="text-sm text-muted">© {new Date().getFullYear()} Cynthia Productions</p>
      </div>
    </footer>
  )
}
