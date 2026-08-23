import Image from 'next/image'
import type { Metadata } from 'next'
import { Logo, Mark } from '@/components/site/Logo'

export const metadata: Metadata = {
  title: 'Brand',
  robots: { index: false, follow: false },
}

type LogoCard = {
  src: string
  title: string
  note: string
  wide?: boolean
}

const round1: LogoCard[] = [
  {
    src: '/images/brand/logos/08-wordmark-nb.png',
    title: '1 · Gulf wordmark',
    note: 'Clean type. Best header if we skip a mark.',
  },
  {
    src: '/images/brand/logos/09-lockup-nb.png',
    title: '2 · Piano-wave lockup',
    note: 'Sun + keys-as-wave + Cynthia / Music. The live SVG came from this.',
    wide: true,
  },
  {
    src: '/images/brand/logos/10-dove-wave-nb.png',
    title: '3 · Dove wave',
    note: 'Matches “to heal the world with music.” Softer, more personal.',
  },
  {
    src: '/images/brand/logos/11-cm-monogram-nb.png',
    title: '4 · CM monogram',
    note: 'App icon / social avatar.',
  },
  {
    src: '/images/brand/logos/12-sunrise-badge-nb.png',
    title: '5 · Sunrise badge',
    note: 'Sticker, merch, course watermark.',
  },
  {
    src: '/images/brand/logos/13-horizon-script-nb.png',
    title: '6 · Horizon script',
    note: 'More signature, less school.',
  },
  {
    src: '/images/brand/logos/07-icon-piano-sun.png',
    title: '7 · Abstract sun keys',
    note: 'Simplest mark. Peach-heavy.',
  },
  {
    src: '/images/brand/logos/14-lockup-transparent.png',
    title: '8 · Graphic lockup',
    note: 'Flatter sun-and-keys circle with stacked type.',
    wide: true,
  },
  {
    src: '/images/brand/logos/01-wordmark-wave.png',
    title: '9 · Retro wave',
    note: 'Punchier poster energy.',
  },
  {
    src: '/images/brand/logos/02-piano-wave-lockup.png',
    title: '10 · Split lockup',
    note: 'Circle mark + stacked type on color blocks.',
  },
  {
    src: '/images/brand/logos/03-sunrise-badge.png',
    title: '11 · Piano pier poster',
    note: 'Travel-poster badge. Busy for a nav logo.',
  },
  {
    src: '/images/brand/logos/04-dove-wave.png',
    title: '12 · Dove + color blocks',
    note: 'Playful kids-class energy.',
  },
  {
    src: '/images/brand/logos/05-cm-monogram.png',
    title: '13 · Geometric CM',
    note: 'Sharper, more design-school.',
  },
  {
    src: '/images/brand/logos/06-horizon-script.png',
    title: '14 · Night shoreline script',
    note: 'Dusk look. Heavier than the new site.',
  },
]

const round2: LogoCard[] = [
  {
    src: '/images/brand/logos/r2/A-porthole.png',
    title: 'A · Porthole',
    note: 'Circular window onto the cover world. Strong emblem.',
  },
  {
    src: '/images/brand/logos/r2/B-lockup.png',
    title: 'B · Piano lockup',
    note: 'Header-ready. Same white piano in gulf water as the covers.',
    wide: true,
  },
  {
    src: '/images/brand/logos/r2/C-icon.png',
    title: 'C · Keys at the sun',
    note: 'Best favicon / app icon. Matches Play Thousands.',
  },
  {
    src: '/images/brand/logos/r2/D-wordmark.png',
    title: 'D · Wordmark + tide',
    note: 'Cleanest type. Photoreal waterline instead of a drawn wave.',
  },
  {
    src: '/images/brand/logos/r2/E-piano-mark.png',
    title: 'E · Piano on the gulf',
    note: 'Literal cover-as-mark. Soft, premium.',
  },
  {
    src: '/images/brand/logos/r2/F-keys-sun.png',
    title: 'F · Keys + sun stack',
    note: 'Simple stacked mark. Easy to reproduce.',
  },
  {
    src: '/images/brand/logos/r2/G-script-tide.png',
    title: 'G · Script tide',
    note: 'More Cynthia-personal. Scene-heavy — better as a signature than a nav logo.',
  },
  {
    src: '/images/brand/logos/r2/H-stamp.png',
    title: 'H · Stamp',
    note: 'Badge for workbooks, merch, watermarks.',
  },
  {
    src: '/images/brand/logos/r2/I-monogram.png',
    title: 'I · C monogram',
    note: 'Letter C made of keys over gulf water. Distinctive at small sizes.',
  },
  {
    src: '/images/brand/logos/r2/J-transparent.png',
    title: 'J · Graphic lockup',
    note: 'Flatter, more icon-like. Generated on black — we’d knock the background out.',
    wide: true,
  },
]

const covers = [
  { src: '/images/courses/one-hour-piano.jpg', title: 'One Hour Piano' },
  { src: '/images/courses/music-is-numbers.jpg', title: 'Music is Numbers' },
  { src: '/images/courses/play-thousands.jpg', title: 'Play Thousands of Songs' },
  { src: '/images/courses/piano-bundle.jpg', title: 'The Piano Family Bundle' },
]

function LogoGrid({ items }: { items: LogoCard[] }) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((logo) => (
        <figure key={logo.src} className="card overflow-hidden">
          <Image
            src={logo.src}
            alt={logo.title}
            width={800}
            height={800}
            className={
              logo.wide
                ? 'aspect-[16/9] w-full bg-horizon/5 object-contain'
                : 'aspect-square w-full object-cover'
            }
          />
          <figcaption className="p-5">
            <p className="font-display text-xl text-horizon">{logo.title}</p>
            <p className="mt-2 text-base text-muted">{logo.note}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export default function BrandPage() {
  return (
    <main className="mx-auto max-w-site px-6 py-16 lg:px-10">
      <p className="kicker">Internal · not in the nav</p>
      <h1 className="font-display mt-5 text-5xl text-horizon md:text-6xl">Cynthia Music rebrand</h1>
      <p className="mt-5 max-w-2xl text-xl text-muted">
        Both logo rounds are here. Covers stay locked. Pick any letter or number and we put it in the
        header.
      </p>

      <section className="card mt-12 p-8 md:p-10">
        <p className="text-base font-semibold text-gulf-deep">Currently live (placeholder SVG)</p>
        <div className="mt-8 flex flex-wrap items-end gap-10">
          <div className="rounded-3xl bg-foam p-8 outline outline-card-border">
            <Logo />
          </div>
          <div className="rounded-3xl bg-horizon p-8">
            <Logo inverted />
          </div>
          <div className="flex items-center gap-4">
            <Mark className="h-16 w-16 text-gulf" />
            <Mark className="h-12 w-12 text-gulf" />
            <Mark className="h-8 w-8 text-gulf" />
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-4xl text-horizon">Logo round 1</h2>
        <p className="mt-3 text-lg text-muted">The first set. Cleaner marks and a few wilder poster directions.</p>
        <LogoGrid items={round1} />
      </section>

      <section className="mt-16">
        <h2 className="font-display text-4xl text-horizon">Logo round 2</h2>
        <p className="mt-3 text-lg text-muted">
          Built against the live covers: sparkling gulf, white piano, coral sun.
        </p>
        <LogoGrid items={round2} />
      </section>

      <section className="mt-16">
        <h2 className="font-display text-4xl text-horizon">Course covers</h2>
        <p className="mt-3 text-lg text-muted">Locked.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {covers.map((cover) => (
            <figure key={cover.src} className="card overflow-hidden">
              <Image
                src={cover.src}
                alt={cover.title}
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-5">
                <p className="font-display text-xl text-horizon">{cover.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}
