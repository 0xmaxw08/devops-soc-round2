import { cn } from '@/lib/utils'

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid place-items-center border border-gold font-serif text-lg italic leading-none text-gold',
        className,
      )}
    >
      S&amp;O
    </span>
  )
}
