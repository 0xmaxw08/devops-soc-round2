'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Line = { text: string; tone?: 'cmd' | 'ok' | 'gold' | 'dim' }

const script: Line[] = [
  { text: '$ git push origin closing-argument', tone: 'cmd' },
  { text: '→ The court is now in session…', tone: 'dim' },
  { text: '[1/4] lint ........... no objections', tone: 'ok' },
  { text: '[2/4] test ........... 412 witnesses agree', tone: 'ok' },
  { text: '[3/4] build .......... exhibit sealed (sha: 7f3a9c)', tone: 'ok' },
  { text: '[4/4] deploy ......... k8s/prod — 0 downtime', tone: 'ok' },
  { text: 'VERDICT: DEPLOYED. Case closed in 48s.', tone: 'gold' },
]

export function DocketTerminal() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(script.length)
      return
    }
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= script.length + 6) return 0
        return c + 1
      })
    }, 650)
    return () => clearInterval(id)
  }, [])

  const visible = script.slice(0, Math.min(count, script.length))

  return (
    <figure className="w-full border border-border bg-ink/90 shadow-2xl shadow-black/60 backdrop-blur">
      <figcaption className="flex items-center justify-between border-b border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>Docket No. 26-OPS-0042</span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-signal" />
          In session
        </span>
      </figcaption>
      <div className="min-h-64 p-5 font-mono text-[13px] leading-7" aria-live="off">
        {visible.map((line, i) => (
          <p
            key={i}
            className={cn(
              line.tone === 'cmd' && 'text-foreground',
              line.tone === 'ok' && 'text-signal',
              line.tone === 'dim' && 'text-muted-foreground',
              line.tone === 'gold' && 'mt-2 font-semibold text-gold',
            )}
          >
            {line.text}
          </p>
        ))}
        <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-gold" aria-hidden="true" />
      </div>
    </figure>
  )
}
