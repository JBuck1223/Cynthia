import type { Metadata } from 'next'
import { Fraunces, Source_Sans_3 } from 'next/font/google'
import { SITE } from '@/lib/catalog'
import './globals.css'

const sourceSans = Source_Sans_3({
  variable: '--font-source',
  subsets: ['latin'],
})

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Piano for families`,
    template: `%s | ${SITE.name}`,
  },
  description: `${SITE.promise} From Sarasota. ${SITE.tagline}`,
  openGraph: {
    title: `${SITE.name} | Piano for families`,
    description: SITE.promise,
    type: 'website',
    url: SITE.url,
    images: [{ url: '/images/cynthia/hero.jpg' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full text-horizon antialiased font-sans">{children}</body>
    </html>
  )
}
