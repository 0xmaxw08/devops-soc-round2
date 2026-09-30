'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CornerDownLeft, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FIRM_EMAIL, emitFirmEvent, firmEvents } from '@/lib/firm-data'

type Command = { id: string; group: string; label: string; hint: string; run: () => void }

const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

const goTo = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [litt, setLitt] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  // Only scroll for keyboard moves; hover changes `active` too, and scrolling then makes the list jump under the mouse
  const scrollToActive = useRef(false)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    let seq: string[] = []
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      // Keep the last few keys; letters are lowercased so caps lock doesn't break the code
      seq = [...seq, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-konami.length)
      if (seq.join() === konami.join()) {
        seq = []
        emitFirmEvent(firmEvents.littUp)
      }
    }
    const onLitt = () => setLitt(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(firmEvents.openPalette, onOpen)
    window.addEventListener(firmEvents.littUp, onLitt)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(firmEvents.openPalette, onOpen)
      window.removeEventListener(firmEvents.littUp, onLitt)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement | null
    setQuery('')
    setActive(0)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      document.body.style.overflow = prevOverflow
      returnFocus.current?.focus({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!litt) return
    const timer = setTimeout(() => setLitt(false), 3200)
    return () => clearTimeout(timer)
  }, [litt])

  const commands = useMemo<Command[]>(
    () => [
      { id: 'top', group: 'Navigate', label: 'Lobby', hint: 'Top of page', run: goTo('top') },
      { id: 'brief', group: 'Navigate', label: 'The Firm', hint: 'What the club is about', run: goTo('brief') },
      { id: 'practice', group: 'Navigate', label: 'Practice Areas', hint: 'What we teach', run: goTo('practice') },
      { id: 'cases', group: 'Navigate', label: 'Case Files', hint: 'Events & wins', run: goTo('cases') },
      { id: 'motion', group: 'Navigate', label: 'Exhibit A — Motion to Deploy', hint: 'Live pipeline', run: goTo('motion') },
      { id: 'partners', group: 'Navigate', label: 'The Partners', hint: 'Team', run: goTo('partners') },
      { id: 'deposition', group: 'Navigate', label: 'Exhibit B — The Deposition', hint: 'Terminal', run: goTo('deposition') },
      { id: 'retain', group: 'Navigate', label: 'Retain Us', hint: 'Join the club', run: goTo('retain') },
      {
        id: 'deploy',
        group: 'Actions',
        label: 'File a motion to deploy',
        hint: 'Run pipeline',
        run: () => emitFirmEvent(firmEvents.fileMotion),
      },
      {
        id: 'shell',
        group: 'Actions',
        label: 'Cross-examine the firm',
        hint: 'Open shell',
        run: () => emitFirmEvent(firmEvents.focusDeposition),
      },
      {
        id: 'email',
        group: 'Actions',
        label: 'Copy firm email',
        hint: FIRM_EMAIL,
        run: () => {
          navigator.clipboard?.writeText(FIRM_EMAIL).then(
            () => setToast(`Copied ${FIRM_EMAIL} to clipboard.`),
            () => setToast(FIRM_EMAIL),
          )
        },
      },
      { id: 'litt', group: 'Classified', label: 'Get Litt up', hint: '↑↑↓↓←→←→BA', run: () => emitFirmEvent(firmEvents.littUp) },
    ],
    [],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => `${c.label} ${c.hint} ${c.group}`.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => {
    if (!open || !scrollToActive.current) return
    scrollToActive.current = false
    // Scroll the <li> (not just the option) so the group heading stays visible with its first item
    document.getElementById(`palette-${filtered[active]?.id}`)?.parentElement?.scrollIntoView({ block: 'nearest' })
  }, [open, active, filtered])

  const choose = (cmd: Command | undefined) => {
    if (!cmd) return
    setOpen(false)
    // Wait a tick so the palette has closed and handed focus back before the command runs
    setTimeout(cmd.run, 50)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      scrollToActive.current = true
      setActive((a) => (filtered.length ? (a + 1) % filtered.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      scrollToActive.current = true
      setActive((a) => (filtered.length ? (a - 1 + filtered.length) % filtered.length : 0))
    } else if (e.key === 'Enter') {
      // Enter that confirms an IME candidate shouldn't run a command
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      choose(filtered[active])
    }
  }

  let lastGroup = ''

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-xl border border-border bg-card shadow-2xl shadow-black/70"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  scrollToActive.current = true
                  setActive(0)
                }}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={filtered[active] ? `palette-${filtered[active].id}` : undefined}
                aria-label="Search commands"
                placeholder="What does the court want?"
                className="h-14 flex-1 bg-transparent font-serif text-xl outline-none placeholder:text-muted-foreground/60"
              />
              <kbd className="border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">ESC</kbd>
            </div>
            <ul id="palette-list" role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center font-mono text-xs text-muted-foreground">
                  No precedent found. Try another word.
                </li>
              )}
              {filtered.map((c, i) => {
                const showGroup = c.group !== lastGroup
                lastGroup = c.group
                return (
                  <li key={c.id} role="presentation">
                    {showGroup && (
                      <p className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        {c.group}
                      </p>
                    )}
                    {/* mousemove, not mouseenter: scrolling the list under a still cursor shouldn't change the active row */}
                    <div
                      id={`palette-${c.id}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseMove={() => {
                        scrollToActive.current = false
                        setActive(i)
                      }}
                      onClick={() => choose(c)}
                      className={cn(
                        'mx-2 flex cursor-pointer items-center justify-between gap-4 px-3 py-2.5',
                        i === active ? 'bg-gold text-ink' : 'text-foreground',
                      )}
                    >
                      <span className="text-sm">{c.label}</span>
                      <span
                        className={cn(
                          'flex items-center gap-2 font-mono text-[11px]',
                          i === active ? 'text-ink/70' : 'text-muted-foreground',
                        )}
                      >
                        {c.hint}
                        {i === active && <CornerDownLeft className="size-3" aria-hidden="true" />}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>↑↓ navigate · Enter execute</span>
              <span>Specter &amp; Ops</span>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 border border-gold bg-ink px-5 py-3 font-mono text-xs text-gold shadow-xl"
        >
          {toast}
        </div>
      )}

      {litt && (
        <div
          role="status"
          className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-ink/60 backdrop-blur-sm"
        >
          <div className="flex animate-stamp flex-col items-center gap-3 border-4 border-gold px-6 py-6 md:border-8 md:px-10 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold">Classified · Exhibit L</p>
            <p className="font-serif text-5xl uppercase text-gold md:text-8xl">Litt Up!</p>
            <p className="font-mono text-xs text-foreground/80">You found the easter egg. Louis is... moved.</p>
          </div>
        </div>
      )}
    </>
  )
}
