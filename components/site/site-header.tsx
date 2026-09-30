'use client'

import { useState } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { emitFirmEvent, firmEvents } from '@/lib/firm-data'
import { Monogram } from './monogram'

const links = [
  { href: '#brief', label: 'The Firm' },
  { href: '#practice', label: 'Practice' },
  { href: '#cases', label: 'Case Files' },
  { href: '#partners', label: 'Partners' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="Specter & Ops home">
          <Monogram className="size-9" />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-serif text-xl tracking-wide">Specter &amp; Ops</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Attorneys at Deploy
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => emitFirmEvent(firmEvents.openPalette)}
            className="flex items-center gap-2 border border-border px-3 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-gold hover:text-gold"
            aria-label="Open command palette"
          >
            <Search className="size-3.5" aria-hidden="true" />
            <kbd className="font-mono">Ctrl K</kbd>
          </button>
          <a
            href="#retain"
            className="border border-gold px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            Retain Us
          </a>
        </nav>

        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => emitFirmEvent(firmEvents.openPalette)}
            aria-label="Open command palette"
            className="p-2"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="-mr-2 p-2"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border bg-ink md:hidden">
          <ul className="flex flex-col px-5 py-4">
            {[...links, { href: '#retain', label: 'Retain Us' }].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-serif text-2xl hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
