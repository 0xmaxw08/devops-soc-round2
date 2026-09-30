import Image from 'next/image'
import { SectionLabel } from './section-label'

const articles = [
  {
    no: 'I',
    title: 'Purpose of the Firm',
    body: 'We exist to close the gap between "it works on my machine" and "it works for everyone." Members learn to build, ship and run software the way the best engineering teams do.',
  },
  {
    no: 'II',
    title: 'Method of Practice',
    body: 'Weekly hands-on sessions, mock incident drills, infrastructure hackathons and code reviews held with the rigour of cross-examination. No slides without a terminal.',
  },
  {
    no: 'III',
    title: 'Admission to the Bar',
    body: 'Open to every student, every branch, every year. Prior experience is not required — only the willingness to break things in staging and fix them before production.',
  },
  {
    no: 'IV',
    title: 'Code of Conduct',
    body: 'We blame the process, never the person. Every outage earns a postmortem, every postmortem earns a fix, and every fix earns a round of chai.',
  },
]

const exhibits = [
  { label: 'Exhibit A', value: '340+', note: 'Members admitted' },
  { label: 'Exhibit B', value: '62', note: 'Cases argued (workshops)' },
  { label: 'Exhibit C', value: '99.9%', note: 'Club site uptime' },
  { label: 'Exhibit D', value: '0', note: 'Manual deploys since 2023' },
]

export function TheBrief() {
  return (
    <section id="brief" className="bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionLabel index="01" className="text-ink/60">
          The Brief
        </SectionLabel>

        <div className="mt-10 grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-serif text-5xl leading-[0.95] text-balance md:text-7xl">
              In the matter of <span className="italic">Manual Deployments</span> v. The Student Body.
            </h2>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden">
              <Image
                src="/images/desk.png"
                alt="A law firm desk with case files, a fountain pen and a laptop showing deployment logs"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <span className="absolute right-4 top-4 -rotate-6 border-2 border-paper px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.3em] text-paper">
                Confidential
              </span>
            </div>
          </div>

          <div className="relative border border-ink/15 bg-paper p-6 shadow-[8px_8px_0_0_var(--ink)] md:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/20 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
              <span>Filed: Supreme Court of Campus</span>
              <span>Case 26-OPS-0001</span>
            </div>
            <p className="mt-6 font-serif text-2xl italic leading-snug">
              &ldquo;The Firm hereby declares that no student shall suffer the indignity of FTP-ing
              files onto a production server ever again.&rdquo;
            </p>

            <ol className="mt-8 divide-y divide-ink/15">
              {articles.map((a) => (
                <li key={a.no} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                  <span className="font-serif text-3xl italic text-ink/40">{a.no}.</span>
                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em]">
                      Article {a.no} — {a.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-ink/75">{a.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex items-end justify-between gap-6 border-t border-ink/20 pt-6">
              <div>
                <p className="font-serif text-3xl italic">Aarav Specter</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
                  Managing Partner, Signed &amp; Sealed
                </p>
              </div>
              <span
                aria-hidden="true"
                className="grid size-20 shrink-0 rotate-12 place-items-center rounded-full border-2 border-dashed border-ink/50 text-center font-mono text-[9px] font-bold uppercase leading-tight tracking-widest text-ink/60"
              >
                Approved
                <br />
                for prod
              </span>
            </div>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-2 border-t border-ink/20 lg:grid-cols-4">
          {exhibits.map((e) => (
            <div key={e.label} className="border-b border-ink/20 py-8 pr-4 lg:border-b-0 lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0">
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">{e.label}</dt>
              <dd className="mt-3 font-serif text-5xl md:text-6xl">{e.value}</dd>
              <dd className="mt-1 text-sm text-ink/70">{e.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
