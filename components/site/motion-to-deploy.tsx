'use client'

import { useEffect, useRef, useState } from 'react'
import { Gavel, RotateCcw, Scale, Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { firmEvents } from '@/lib/firm-data'
import { SectionLabel } from './section-label'

type Status = 'idle' | 'running' | 'objection' | 'won' | 'settled'
type LogLine = { id: number; tone: 'dim' | 'ok' | 'err' | 'gold'; text: string }

const stages = [
  { label: 'Motion Filed', detail: 'git push origin main', ms: 700 },
  { label: 'Discovery', detail: 'eslint · hadolint · tflint', ms: 1100 },
  { label: 'Cross-Examination', detail: '412 unit · 38 e2e', ms: 1500 },
  { label: 'Exhibit Sealed', detail: 'docker build · sbom · cosign', ms: 1200 },
  { label: 'Verdict', detail: 'argocd sync · canary 10→100%', ms: 1400 },
]

const TEST_STAGE = 2

export function MotionToDeploy() {
  const [status, setStatus] = useState<Status>('idle')
  const [stage, setStage] = useState(0)
  const [chaos, setChaos] = useState(false)
  const [overruled, setOverruled] = useState(false)
  const [log, setLog] = useState<LogLine[]>([])
  const [stats, setStats] = useState({ filed: 0, won: 0, lastMs: 0 })
  const startedAt = useRef(0)
  const lineId = useRef(0)
  const sectionRef = useRef<HTMLElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  const push = (tone: LogLine['tone'], text: string) => {
    const t = ((performance.now() - startedAt.current) / 1000).toFixed(1)
    lineId.current += 1
    setLog((l) => [...l, { id: lineId.current, tone, text: `[+${t}s] ${text}` }])
  }

  const fileMotion = () => {
    if (status === 'running') return
    startedAt.current = performance.now()
    lineId.current = 0
    setLog([])
    setOverruled(false)
    setStage(0)
    setStatus('running')
    setStats((s) => ({ ...s, filed: s.filed + 1 }))
  }

  const fileMotionRef = useRef(fileMotion)
  fileMotionRef.current = fileMotion

  useEffect(() => {
    const onFile = () => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      fileMotionRef.current()
    }
    window.addEventListener(firmEvents.fileMotion, onFile)
    return () => window.removeEventListener(firmEvents.fileMotion, onFile)
  }, [])

  useEffect(() => {
    if (status !== 'running') return
    const current = stages[stage]
    const timer = setTimeout(() => {
      if (stage === TEST_STAGE && chaos && !overruled) {
        push('err', `${current.label} — FAILED: opposing counsel found a flaky test`)
        push('err', 'OBJECTION! Pipeline halted pending ruling.')
        setStatus('objection')
        return
      }
      push('ok', `${current.label} — ${current.detail} [sustained]`)
      if (stage === stages.length - 1) {
        const ms = performance.now() - startedAt.current
        push('gold', `VERDICT: DEPLOYED to prod in ${(ms / 1000).toFixed(1)}s. Case closed.`)
        setStats((s) => ({ ...s, won: s.won + 1, lastMs: ms }))
        setStatus('won')
        return
      }
      setStage(stage + 1)
    }, current.ms)
    return () => clearTimeout(timer)
  }, [status, stage, chaos, overruled])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log])

  const overrule = () => {
    push('gold', 'Judge: OVERRULED. Retrying with quarantined test…')
    setOverruled(true)
    setStatus('running')
  }

  const settle = () => {
    push('dim', 'Settled out of court: rolled back to v2.4.1. Nobody got paged.')
    setStatus('settled')
  }

  const stageState = (i: number) => {
    if (status === 'idle') return 'pending'
    if (status === 'objection' && i === stage) return 'failed'
    if (status === 'settled' && i >= stage) return 'pending'
    if (status === 'won' || i < stage) return 'done'
    if (i === stage && status === 'running') return 'active'
    return 'pending'
  }

  const winRate = stats.filed ? Math.round((stats.won / stats.filed) * 100) : 100
  const busy = status === 'running'

  return (
    <section
      id="motion"
      ref={sectionRef}
      className="scroll-mt-16 border-t border-border bg-card/40"
      aria-labelledby="motion-title"
    >
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionLabel index="EX-A">Live Demonstration</SectionLabel>
        <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2 id="motion-title" className="max-w-3xl font-serif text-5xl leading-[0.95] text-balance md:text-7xl">
            File a motion <span className="italic text-gold">to deploy.</span>
          </h2>
          <p className="max-w-sm leading-relaxed text-muted-foreground">
            Every commit stands trial. Watch it face the pipeline. Invite opposing counsel to inject a
            failure, then rule on the objection yourself.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fileMotion}
            disabled={busy}
            className="inline-flex items-center gap-2 bg-gold px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Gavel className="size-4" aria-hidden="true" />
            {status === 'idle' ? 'File motion' : busy ? 'In session…' : 'File new motion'}
          </button>
          <button
            type="button"
            aria-pressed={chaos}
            onClick={() => setChaos((c) => !c)}
            className={cn(
              'inline-flex items-center gap-3 border px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors',
              chaos ? 'border-destructive text-destructive' : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            <span
              className={cn(
                'relative block h-4 w-7 shrink-0 overflow-hidden rounded-full transition-colors',
                chaos ? 'bg-destructive' : 'bg-muted',
              )}
              aria-hidden="true"
            >
              <span
                className={cn(
                  'absolute left-0.5 top-0.5 block size-3 rounded-full bg-foreground transition-transform duration-200',
                  chaos ? 'translate-x-3' : 'translate-x-0',
                )}
              />
            </span>
            <span className="whitespace-nowrap">Opposing counsel {chaos ? 'present' : 'absent'}</span>
          </button>
        </div>

        <ol className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-5">
          {stages.map((s, i) => {
            const state = stageState(i)
            return (
              <li
                key={s.label}
                className={cn(
                  'relative flex flex-col gap-3 bg-ink p-5 transition-colors',
                  state === 'active' && 'bg-gold/10',
                  state === 'failed' && 'bg-destructive/15',
                )}
              >
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em]">
                  <span className="text-muted-foreground">Stage {String(i + 1).padStart(2, '0')}</span>
                  <span
                    className={cn(
                      state === 'done' && 'text-signal',
                      state === 'active' && 'animate-pulse text-gold',
                      state === 'failed' && 'text-destructive',
                      state === 'pending' && 'text-muted-foreground/60',
                    )}
                  >
                    {state === 'done' ? 'Sustained' : state === 'active' ? 'Hearing' : state === 'failed' ? 'Objection' : 'Pending'}
                  </span>
                </div>
                <p className="font-serif text-2xl leading-tight">{s.label}</p>
                <p className="font-mono text-xs text-muted-foreground">{s.detail}</p>
                <span
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-0.5 origin-left transition-transform duration-700',
                    state === 'done' && 'scale-x-100 bg-signal',
                    state === 'active' && 'scale-x-50 bg-gold',
                    state === 'failed' && 'scale-x-100 bg-destructive',
                    state === 'pending' && 'scale-x-0',
                  )}
                  aria-hidden="true"
                />
              </li>
            )
          })}
        </ol>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="relative border border-border bg-ink">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>Court Transcript</span>
              <span>{status === 'idle' ? 'Awaiting filing' : status}</span>
            </div>
            <div
              ref={logRef}
              className="h-56 overflow-y-auto p-5 font-mono text-[13px] leading-7"
              role="log"
              aria-live="polite"
            >
              {log.length === 0 && (
                <p className="text-muted-foreground">{'$ awaiting motion… press "File motion" to begin.'}</p>
              )}
              {log.map((l) => (
                <p
                  key={l.id}
                  className={cn(
                    l.tone === 'ok' && 'text-signal',
                    l.tone === 'err' && 'text-destructive',
                    l.tone === 'gold' && 'font-semibold text-gold',
                    l.tone === 'dim' && 'text-muted-foreground',
                  )}
                >
                  {l.text}
                </p>
              ))}
            </div>

            {status === 'objection' && (
              <div className="flex flex-col items-start gap-3 sm:absolute sm:inset-x-0 sm:bottom-0 border-t border-destructive/40 bg-ink/95 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <p className="font-serif text-2xl text-destructive">How does the court rule?</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={overrule}
                    className="inline-flex items-center gap-2 bg-gold px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ink"
                  >
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Overrule
                  </button>
                  <button
                    type="button"
                    onClick={settle}
                    className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] hover:border-foreground"
                  >
                    <Undo2 className="size-4" aria-hidden="true" />
                    Settle (rollback)
                  </button>
                </div>
              </div>
            )}

            {(status === 'won' || status === 'objection') && (
              <p
                key={`${status}-${stats.filed}`}
                className={cn(
                  'pointer-events-none absolute right-6 top-16 animate-stamp border-4 px-4 py-1 font-serif text-3xl uppercase tracking-wider md:text-4xl',
                  status === 'won' ? 'border-gold text-gold' : 'border-destructive text-destructive',
                )}
                aria-hidden="true"
              >
                {status === 'won' ? 'Case Closed' : 'Objection!'}
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-px border border-border bg-border">
            <Stat label="Motions filed" value={String(stats.filed).padStart(2, '0')} />
            <Stat label="Verdicts won" value={String(stats.won).padStart(2, '0')} />
            <Stat label="Win rate" value={`${winRate}%`} />
            <Stat label="Last verdict" value={stats.lastMs ? `${(stats.lastMs / 1000).toFixed(1)}s` : '—'} />
            <div className="col-span-2 flex items-center gap-3 bg-ink p-5 text-sm text-muted-foreground">
              <Scale className="size-5 shrink-0 text-gold" aria-hidden="true" />
              <span>Tip: turn on opposing counsel to see how the firm handles a red build.</span>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 bg-ink p-5">
      <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd className="font-serif text-4xl tabular-nums">{value}</dd>
    </div>
  )
}
