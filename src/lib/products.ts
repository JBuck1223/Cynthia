import { bundle, courses, PRICE } from '@/lib/catalog'

export type SellableSku = (typeof courses)[number]['sku'] | typeof bundle.sku

export function productForSku(sku: string) {
  if (sku === bundle.sku) {
    return {
      sku: bundle.sku,
      name: bundle.title,
      priceCents: bundle.priceCents,
      courseSlugs: bundle.courseSlugs,
    }
  }
  const course = courses.find((c) => c.sku === sku)
  if (!course) return null
  return {
    sku: course.sku,
    name: course.title,
    priceCents: course.priceCents,
    courseSlugs: [course.slug],
  }
}

export function stripePriceEnv(sku: string) {
  const map: Record<string, string | undefined> = {
    'one-hour-piano': process.env.STRIPE_PRICE_ONE_HOUR_PIANO,
    'music-is-numbers': process.env.STRIPE_PRICE_MUSIC_IS_NUMBERS,
    'play-thousands': process.env.STRIPE_PRICE_PLAY_THOUSANDS,
    'piano-bundle': process.env.STRIPE_PRICE_BUNDLE,
  }
  return map[sku]
}

export { PRICE }
