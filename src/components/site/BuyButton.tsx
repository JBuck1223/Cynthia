import { bundle, formatPrice, PRICE } from '@/lib/catalog'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function BuyButton({
  sku,
  label,
  className,
}: {
  sku: string
  label?: string
  className?: string
}) {
  const cents = sku === bundle.sku ? PRICE.bundleCents : PRICE.courseCents
  return (
    <Link
      href={`/checkout?sku=${encodeURIComponent(sku)}`}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-foam transition-colors hover:bg-coral-deep',
        className,
      )}
    >
      {label ?? `Buy · ${formatPrice(cents)}`}
    </Link>
  )
}
