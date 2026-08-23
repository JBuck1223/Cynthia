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
        'btn bg-coral text-foam shadow-[0_16px_36px_-14px_rgba(255,122,92,0.95)] hover:bg-coral-deep',
        className,
      )}
    >
      {label ?? `Buy · ${formatPrice(cents)}`}
    </Link>
  )
}
