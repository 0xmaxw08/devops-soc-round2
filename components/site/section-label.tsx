import { cn } from '@/lib/utils'

export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground',
        className,
      )}
    >
      <span>§ {index}</span>
      <span className="h-px w-12 bg-current opacity-50" />
      <span>{children}</span>
    </p>
  )
}
