import { ArrowUpRight } from 'lucide-react'
import { SectionLabel } from './section-label'

const areas = [
  {
    legal: 'Litigation',
    tech: 'CI/CD Pipelines',
    desc: 'GitHub Actions, Jenkins and GitLab CI. Every commit goes to trial; only the innocent reach production.',
    tools: ['GitHub Actions', 'Jenkins', 'ArgoCD'],
  },
  {
    legal: 'Corporate Law',
    tech: 'Containers & Orchestration',
    desc: 'Docker images drafted like airtight contracts, Kubernetes clusters that enforce every clause.',
    tools: ['Docker', 'Kubernetes', 'Helm'],
  },
  {
    legal: 'Real Estate',
    tech: 'Cloud Infrastructure',
    desc: 'Prime property on AWS, GCP and Azure. We negotiate the lease, you keep the free tier.',
    tools: ['AWS', 'GCP', 'Azure'],
  },
  {
    legal: 'Contract Law',
    tech: 'Infrastructure as Code',
    desc: 'If it is not written in Terraform, it did not happen. Reviewable, versioned, legally binding infra.',
    tools: ['Terraform', 'Ansible', 'Pulumi'],
  },
  {
    legal: 'Discovery',
    tech: 'Observability',
    desc: 'Metrics, logs and traces subpoenaed from every service. Nothing hides from a good dashboard.',
    tools: ['Prometheus', 'Grafana', 'Loki'],
  },
  {
    legal: 'Crisis Management',
    tech: 'Incident Response & SRE',
    desc: 'Pager at 3 AM? We run the room. On-call rotations, runbooks and blameless postmortems.',
    tools: ['PagerDuty', 'SLOs', 'Chaos Eng.'],
  },
]

export function PracticeAreas() {
  return (
    <section id="practice" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <SectionLabel index="02">Practice Areas</SectionLabel>
          <h2 className="mt-8 max-w-3xl font-serif text-5xl leading-[0.95] text-balance md:text-7xl">
            Six specialties. <span className="italic text-gold">One</span> undefeated record.
          </h2>
        </div>
        <p className="max-w-sm text-muted-foreground leading-relaxed">
          Every member rotates through each practice before picking a specialty. Like any good firm,
          we expect associates to know a little about everything and everything about something.
        </p>
      </div>

      <ul className="mt-16 border-t border-border">
        {areas.map((a, i) => (
          <li key={a.tech} className="group border-b border-border">
            <div className="grid gap-4 py-8 transition-colors md:grid-cols-[4rem_1fr_1.3fr_auto] md:items-center md:gap-8 md:px-4 md:group-hover:bg-card">
              <span className="font-mono text-sm text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">{a.legal}</p>
                <h3 className="mt-1 font-serif text-3xl md:text-4xl">{a.tech}</h3>
              </div>
              <div>
                <p className="leading-relaxed text-muted-foreground">{a.desc}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {a.tools.map((t) => (
                    <li
                      key={t}
                      className="border border-border px-2 py-0.5 font-mono text-[11px] text-foreground/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <ArrowUpRight
                aria-hidden="true"
                className="hidden size-6 text-muted-foreground transition-all group-hover:rotate-45 group-hover:text-gold md:block"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
