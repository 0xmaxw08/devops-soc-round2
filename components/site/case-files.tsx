'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { SectionLabel } from './section-label'

type Status = 'Won' | 'Pending' | 'Settled'

const cases: {
  no: string
  title: string
  kind: string
  date: string
  status: Status
  summary: string
}[] = [
  {
    no: '26-CV-0142',
    title: 'Specter v. Downtime',
    kind: 'Hackathon',
    date: 'Nov 14–15, 2026',
    status: 'Pending',
    summary: '24-hour infra hackathon. Teams must deploy a 3-tier app that survives a live chaos monkey.',
  },
  {
    no: '26-CV-0131',
    title: 'The People v. YAML Indentation',
    kind: 'Workshop',
    date: 'Oct 22, 2026',
    status: 'Pending',
    summary: 'Kubernetes from zero: pods, deployments, services and why two spaces matter.',
  },
  {
    no: '26-CV-0118',
    title: 'In re: Works On My Machine',
    kind: 'Workshop',
    date: 'Sep 09, 2026',
    status: 'Won',
    summary: 'Docker bootcamp. 180 attendees containerised their first app; zero excuses remain.',
  },
  {
    no: '26-CV-0097',
    title: 'Ross v. Friday Deploys',
    kind: 'Talk',
    date: 'Aug 21, 2026',
    status: 'Won',
    summary: 'Guest SRE from a unicorn startup on progressive delivery, feature flags and canaries.',
  },
  {
    no: '25-CV-0311',
    title: 'Litt v. The Monolith',
    kind: 'Project',
    date: 'Mar 2026',
    status: 'Settled',
    summary: 'Migrated the college fest portal to microservices on k3s. Monolith agreed to a peaceful split.',
  },
  {
    no: '25-CV-0277',
    title: 'Paulsen v. Alert Fatigue',
    kind: 'Project',
    date: 'Jan 2026',
    status: 'Won',
    summary: 'Built the campus status page with Prometheus and Grafana. Alerts down 70%, sleep up 100%.',
  },
]

const filters = ['All', 'Won', 'Pending', 'Settled'] as const

export function CaseFiles() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const shown = filter === 'All' ? cases : cases.filter((c) => c.status === filter)

  return (
    <section id="cases" className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionLabel index="03">Case Files</SectionLabel>
        <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2 className="max-w-2xl font-serif text-5xl leading-[0.95] text-balance md:text-7xl">
            The docket. <span className="italic text-gold">Events, projects</span> &amp; verdicts.
          </h2>
          <div role="tablist" aria-label="Filter cases by status" className="flex border border-border">
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                type="button"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors',
                  filter === f ? 'bg-gold text-ink' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <li key={c.no} className="group relative pt-6">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-6 w-2/5 bg-paper/90 transition-colors group-hover:bg-gold"
                style={{ clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0 100%)' }}
              />
              <article className="relative flex h-full flex-col bg-paper p-6 text-ink transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
                  <span>No. {c.no}</span>
                  <span>{c.kind}</span>
                </div>
                <h3 className="mt-6 font-serif text-3xl leading-tight">{c.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-ink/70">{c.summary}</p>
                <div className="mt-8 flex items-end justify-between">
                  <time className="font-mono text-xs text-ink/60">{c.date}</time>
                  <Stamp status={c.status} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Stamp({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        '-rotate-12 border-2 px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.25em]',
        status === 'Won' && 'border-emerald-700 text-emerald-700',
        status === 'Pending' && 'border-ink/60 text-ink/60',
        status === 'Settled' && 'border-amber-700 text-amber-700',
      )}
    >
      {status}
    </span>
  )
}
