import Link from 'next/link'
import { SITE } from '@/lib/catalog'

export function Footer() {
  return (
    <footer className="bg-horizon text-foam/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl text-foam">Cynthia Music</p>
          <p className="mt-2 max-w-sm text-sm text-foam/60">
            {SITE.tagline}. Piano and composition from {SITE.city}.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link href="/courses" className="hover:text-foam">
            Courses
          </Link>
          <Link href="/books" className="hover:text-foam">
            Books
          </Link>
          <Link href="/studio" className="hover:text-foam">
            Studio
          </Link>
          <a href={`mailto:${SITE.email}`} className="hover:text-foam">
            {SITE.email}
          </a>
        </div>
        <p className="text-sm text-foam/50">© {new Date().getFullYear()} Cynthia Music</p>
      </div>
    </footer>
  )
}
