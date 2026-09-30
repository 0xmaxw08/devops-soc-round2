import { SectionLabel } from './section-label'
import { PartnerCard } from './partner-card'
import { associates, namePartners, seniorPartners } from '@/lib/firm-data'

const n = (a: unknown[]) => String(a.length).padStart(2, '0')
export function Partners() {
  return (
    <section id="partners" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionLabel index="04">The Partners</SectionLabel>
      <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <h2 className="max-w-3xl font-serif text-5xl leading-[0.95] text-balance md:text-7xl">
          The names on the <span className="italic text-gold">door.</span>
        </h2>
        <p className="max-w-sm leading-relaxed text-muted-foreground">
          Hover or tap any card to flip it and read the file. Records are wins–losses in production
          incidents. We keep score.
        </p>
      </div>

      <Tier label="Name Partners" count={n(namePartners)}>
        <ul className="grid gap-6 md:grid-cols-2">
          {namePartners.map((p) => (
            <li key={p.name}>
              <PartnerCard partner={p} size="lg" />
            </li>
          ))}
        </ul>
      </Tier>

      <Tier label="Senior Partners" count={n(seniorPartners)}>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {seniorPartners.map((p) => (
            <li key={p.name}>
              <PartnerCard partner={p} />
            </li>
          ))}
        </ul>
      </Tier>

      <Tier label="Associates" count={n(associates)}>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {associates.map((p) => (
            <li key={p.name}>
              <PartnerCard partner={p} />
            </li>
          ))}
        </ul>
      </Tier>
    </section>
  )
}

function Tier({ label, count, children }: { label: string; count: string; children: React.ReactNode }) {
  return (
    <div className="mt-16">
      <h3 className="mb-6 flex items-center justify-between border-b border-border pb-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
        <span>{label}</span>
        <span className="text-gold">{count}</span>
      </h3>
      {children}
    </div>
  )
}
