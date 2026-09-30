'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { allPartners, emitFirmEvent, firmEvents } from '@/lib/firm-data'
import { SectionLabel } from './section-label'

type Tone = 'in' | 'out' | 'ok' | 'err' | 'gold' | 'dim'
type Line = { id: number; tone: Tone; text: string }

const commandNames = [
  'help',
  'whoami',
  'ls',
  'cat mission.md',
  'kubectl get partners',
  'kubectl describe partner',
  'git log',
  'git blame',
  'uptime',
  'deploy',
  'quote',
  'objection',
  'sudo hire-me',
  'history',
  'clear',
  'exit',
]

const quotes = [
  '"I don\'t get lucky. I make my own luck." — Harvey Specter',
  '"When you\'re backed against the wall, break the goddamn thing down." — Harvey Specter',
  '"You just got Litt up!" — Louis Litt',
  '"I\'m Donna. I know everything." — Donna Paulsen',
  '"Winners don\'t make excuses when the other side plays the game." — Harvey Specter',
]

const quickCommands = ['help', 'kubectl get partners', 'git log', 'sudo hire-me', 'deploy']

const pad = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s.padEnd(n))

function run(input: string, history: string[], mountedAt: number): Omit<Line, 'id'>[] | 'clear' {
  const raw = input.trim()
  const cmd = raw.toLowerCase()
  const out = (text: string, tone: Tone = 'out') => ({ tone, text })

  if (cmd === '') return []
  if (cmd === 'clear') return 'clear'

  if (cmd === 'help')
    return [
      out('Available motions:', 'gold'),
      out('  whoami                      identify yourself to the court'),
      out('  ls / cat mission.md         read the firm charter'),
      out('  kubectl get partners        list every partner on the door'),
      out('  kubectl describe partner X  pull a partner file (e.g. specter)'),
      out('  git log / git blame         recent firm history'),
      out('  deploy                      file a live motion to deploy'),
      out('  quote / objection / uptime  courtroom utilities'),
      out('  sudo hire-me                you know you want to'),
      out('  history / clear             housekeeping'),
      out('Tip: Tab autocompletes, ↑/↓ scroll history.', 'dim'),
    ]

  if (cmd === 'whoami') return [out('guest@specter-ops — associate candidate (unverified)'), out('Clearance: read-only. Ambition: pending review.', 'dim')]

  if (cmd === 'ls') return [out('mission.md   partners/   case-files/   closing-argument.sh   .secrets (denied)')]

  if (cmd === 'cat' || cmd.startsWith('cat ')) {
    const file = cmd.replace('cat', '').trim()
    if (file === 'mission.md')
      return [
        out('# Specter & Ops — Mission', 'gold'),
        out('1. We automate what others do by hand.'),
        out('2. We ship on Fridays because our pipelines let us.'),
        out('3. We write postmortems, not excuses.'),
        out('4. Every member leaves with a production system on their résumé.'),
      ]
    if (file === '.secrets') return [out('Permission denied. Every secret gets a vault. — I. Hardman', 'err')]
    return [out(`cat: ${file || '(missing operand)'}: No such file. Try "cat mission.md".`, 'err')]
  }

  if (cmd === 'kubectl get partners' || cmd === 'kubectl get pods')
    return [
      out(`${pad('NAME', 18)}${pad('ROLE', 22)}${pad('ALIAS', 18)}RECORD`, 'dim'),
      ...allPartners.map((p) => out(`${pad(p.name, 18)}${pad(p.role, 22)}${pad(p.alias, 18)}${p.record}`, 'ok')),
      out(`${allPartners.length}/${allPartners.length} partners Running · 0 restarts`, 'gold'),
    ]

  if (cmd.startsWith('kubectl describe partner')) {
    const q = cmd.replace('kubectl describe partner', '').trim()
    if (!q) return [out('usage: kubectl describe partner <name>  (e.g. litt)', 'err')]
    const p = allPartners.find((x) =>
        x.name.toLowerCase().split(' ').some((w) => w.startsWith(q)),
    )
    if (!p) return [out(`Error: partner "${q}" not found. They may have been disbarred.`, 'err')]
    return [
      out(`Name:     ${p.name}`, 'gold'),
      out(`Title:    ${p.title} — ${p.role}`),
      out(`Alias:    ${p.alias}`),
      out(`Year:     ${p.year}`),
      out(`Stack:    ${p.stack.join(', ')}`),
      out(`Record:   ${p.record} (prod incidents)`),
      out(`Quote:    "${p.quote}"`, 'dim'),
    ]
  }

  if (cmd === 'git log')
    return [
      out('a1f9c3e  feat: K8s bootcamp — 180 associates onboarded', 'ok'),
      out('7e02b1d  fix: hackathon infra survived 9k req/s', 'ok'),
      out('c44d8aa  chore: migrated club site to GitOps', 'ok'),
      out('0b7f12e  docs: postmortem for "The Great DNS Outage"', 'ok'),
      out('9d3e6f1  init: Specter & Ops founded, one Raspberry Pi', 'dim'),
    ]

  if (cmd === 'git blame') return [out('Every line: Rohan Litt. He insists on the credit.', 'gold')]

  if (cmd === 'uptime') {
    const s = Math.floor((Date.now() - mountedAt) / 1000)
    return [out(`You've been in session ${Math.floor(s / 60)}m ${s % 60}s · firm SLA 99.99% · load: associates`, 'ok')]
  }

  if (cmd === 'deploy' || cmd === './closing-argument.sh') {
    emitFirmEvent(firmEvents.fileMotion)
    return [out('Motion filed. Proceeding to Exhibit A — watch the pipeline…', 'gold')]
  }

  if (cmd === 'quote') return [out(quotes[Math.floor(Math.random() * quotes.length)], 'gold')]

  if (cmd === 'objection') return [out('Overruled.', 'gold'), out('(Nice try though.)', 'dim')]

  if (cmd === 'sudo hire-me')
    return [
      out('[sudo] password for associate: ********', 'dim'),
      out('Verifying credentials… portfolio [ok]  urgency [ok]  pipeline instincts [ok]', 'ok'),
      out('ACCESS GRANTED. Harvey wants you in his office. Now.', 'gold'),
    ]

  if (cmd.startsWith('sudo')) return [out("Nice try. You're not a name partner.", 'err')]

  if (cmd.startsWith('rm -rf')) return [out('OBJECTION! Sustained. The court will not allow this.', 'err')]

  if (cmd === 'history') return history.length ? history.map((h, i) => out(`${String(i + 1).padStart(4)}  ${h}`, 'dim')) : [out('No prior testimony.', 'dim')]

  if (cmd === 'exit') return [out("You don't walk out on Harvey Specter.", 'err')]

  return [out(`command not found: ${raw}. Type "help". Harvey doesn't guess — he knows.`, 'err')]
}

const banner: Omit<Line, 'id'>[] = [
  { tone: 'gold', text: 'SPECTER & OPS — Deposition Shell v2.6' },
  { tone: 'dim', text: 'You are now under oath. Type "help" to see what you can ask.' },
]

export function Deposition() {
  const [lines, setLines] = useState<Line[]>(() => banner.map((l, i) => ({ ...l, id: i })))
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const idRef = useRef(banner.length)
  const mountedAt = useRef(Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  useEffect(() => {
    const onFocus = () => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 400)
    }
    window.addEventListener(firmEvents.focusDeposition, onFocus)
    return () => window.removeEventListener(firmEvents.focusDeposition, onFocus)
  }, [])

  const execute = (input: string) => {
    const result = run(input, history, mountedAt.current)
    if (input.trim()) setHistory((h) => [...h, input.trim()])
    setCursor(-1)
    setValue('')
    if (result === 'clear') {
      setLines([])
      return
    }
    const next = [{ tone: 'in' as const, text: input }, ...result].map((l) => {
      idRef.current += 1
      return { ...l, id: idRef.current }
    })
    setLines((prev) => [...prev, ...next])
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) {
      e.preventDefault()
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1)
      setCursor(next)
      setValue(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (cursor === -1) return
      const next = cursor + 1
      if (next >= history.length) {
        setCursor(-1)
        setValue('')
      } else {
        setCursor(next)
        setValue(history[next])
      }
    } else if (e.key === 'Tab') {
      const match = commandNames.find((c) => value && c.startsWith(value.toLowerCase()))
      if (match) {
        e.preventDefault()
        setValue(match)
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <section
      id="deposition"
      ref={sectionRef}
      className="scroll-mt-16 border-t border-border"
      aria-labelledby="deposition-title"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-8">
          <SectionLabel index="EX-B">The Deposition</SectionLabel>
          <h2 id="deposition-title" className="font-serif text-5xl leading-[0.95] text-balance md:text-7xl">
            Cross-examine <span className="italic text-gold">the firm.</span>
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground">
            {"Don't take our word for it. Put us under oath. This is a real shell: query the partners with kubectl, dig through our git history, or trigger a live deploy."}
          </p>
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {quickCommands.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    execute(c)
                    if (window.matchMedia('(hover: hover)').matches) inputRef.current?.focus({ preventScroll: true })
                  }}
                  className="border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col border border-border bg-ink shadow-2xl shadow-black/60"
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-destructive/80" />
              <span className="size-2.5 rounded-full bg-gold/80" />
              <span className="size-2.5 rounded-full bg-signal/80" />
              <span className="ml-2">guest@specter-ops: ~/firm</span>
            </span>
            <span className="hidden sm:inline">Under oath</span>
          </div>
          <div
            ref={scrollRef}
            className="h-96 overflow-auto p-5 font-mono text-[13px] leading-6"
            role="log"
            aria-live="polite"
            aria-label="Deposition transcript"
          >
            {lines.map((l) => (
              <p
                key={l.id}
                className={cn(
                  'whitespace-pre',
                  l.tone === 'in' && 'mt-3 text-foreground first:mt-0',
                  l.tone === 'out' && 'text-foreground/85',
                  l.tone === 'ok' && 'text-signal',
                  l.tone === 'err' && 'text-destructive',
                  l.tone === 'gold' && 'text-gold',
                  l.tone === 'dim' && 'text-muted-foreground',
                )}
              >
                {l.tone === 'in' ? <><span className="text-gold">{'§ '}</span>{l.text}</> : l.text}
              </p>
            ))}
          </div>
          <form
            className="flex items-center gap-2 border-t border-border px-5 py-4 font-mono text-[13px]"
            onSubmit={(e) => {
              e.preventDefault()
              execute(value)
            }}
          >
            <label htmlFor="deposition-input" className="text-gold">
              <span aria-hidden="true">§</span>
              <span className="sr-only">Enter a command</span>
            </label>
            <input
              id="deposition-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder='type "help" and press Enter'
              className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/60 md:text-[13px]"
            />
          </form>
        </div>
      </div>
    </section>
  )
}
