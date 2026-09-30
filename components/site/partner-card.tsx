'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export type Partner = {
  name: string
  title: string
  role: string
  alias: string
  year: string
  quote: string
  stack: string[]
  record: string
}

export function PartnerCard({ partner, size = 'md' }: { partner: Partner; size?: 'md' | 'lg' }) {
  const [flipped, setFlipped] = useState(false)
  const initials = partner.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setFlipped((f) => !f)
        }
      }}
      aria-pressed={flipped}
      aria-label={`${partner.name}, ${partner.title}. ${flipped ? 'Show card front' : 'Show case file'}`}
      className={cn(
        'group block w-full text-left [perspective:1200px]',
        size === 'lg' ? 'aspect-[1.75/1]' : 'aspect-[3/4]',
      )}
    >
      <div
        className={cn(
          'relative size-full transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none',
          'md:group-hover:[transform:rotateY(180deg)]',
          flipped && '[transform:rotateY(180deg)]',
        )}
      >
        {/* Front: business card */}
        <div className="absolute inset-0 flex flex-col justify-between border border-border bg-card p-6 [backface-visibility:hidden]">
          <div className="flex items-start justify-between">
            <span
              aria-hidden="true"
              className={cn(
                'grid place-items-center border border-gold font-serif italic text-gold',
                size === 'lg' ? 'size-20 text-4xl' : 'size-14 text-2xl',
              )}
            >
              {initials}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {partner.title}
            </span>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
              &ldquo;{partner.alias}&rdquo;
            </p>
            <p className={cn('mt-2 font-serif leading-none', size === 'lg' ? 'text-5xl' : 'text-3xl')}>
              {partner.name}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
              <span>{partner.role}</span>
              <span>{partner.year}</span>
            </div>
          </div>
        </div>

        {/* Back: case file */}
        <div className="absolute inset-0 flex flex-col justify-between bg-gold p-6 text-ink [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
            <span>Personnel File</span>
            <span>Record {partner.record}</span>
          </div>
          <p className={cn('font-serif italic leading-tight', size === 'lg' ? 'text-4xl' : 'text-2xl')}>
            &ldquo;{partner.quote}&rdquo;
          </p>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">Admitted to practice in</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {partner.stack.map((s) => (
                <li key={s} className="border border-ink/40 px-2 py-0.5 font-mono text-[11px]">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
