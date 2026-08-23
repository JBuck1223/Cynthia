import { cn } from '@/lib/utils'

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="20" fill="currentColor" />
      <circle cx="32" cy="23" r="9" fill="#FF7A5C" />
      <path
        d="M10 40c6-7 12-7 18 0s12 7 18 0 8-7 14 0"
        fill="none"
        stroke="#fff"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <rect x="18" y="34" width="3.2" height="10" rx="1" fill="#1A4652" />
      <rect x="26.5" y="32.5" width="3.2" height="10" rx="1" fill="#1A4652" />
      <rect x="35" y="34" width="3.2" height="10" rx="1" fill="#1A4652" />
      <rect x="43.5" y="32.5" width="3.2" height="10" rx="1" fill="#1A4652" />
    </svg>
  )
}

export function Logo({
  className,
  inverted = false,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Mark className={cn('h-10 w-10', inverted ? 'text-gulf-light' : 'text-gulf')} />
      <span className="flex items-baseline gap-2 leading-none">
        <span
          className={cn(
            'font-display text-[1.65rem] tracking-tight',
            inverted ? 'text-foam' : 'text-horizon',
          )}
        >
          Cynthia
        </span>
        <span className={cn('text-xl font-semibold', inverted ? 'text-gulf-light' : 'text-gulf')}>
          Music
        </span>
      </span>
    </span>
  )
}
