'use client'

import { useState } from 'react'
import { SectionLabel } from './section-label'

const practices = [
  'CI/CD Pipelines',
  'Containers & Orchestration',
  'Cloud Infrastructure',
  'Infrastructure as Code',
  'Observability',
  'Incident Response & SRE',
]

const fieldClass =
  'w-full border-0 border-b border-ink/30 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-0'
const labelClass = 'font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60'

export function Retainer() {
  const [filed, setFiled] = useState<{ name: string; caseNo: string } | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const caseNo = `26-APP-${Math.floor(1000 + Math.random() * 9000)}`
    setFiled({ name, caseNo })
  }

  return (
    <section id="retain" className="bg-paper text-ink">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionLabel index="05" className="text-ink/60">
            Retain the Firm
          </SectionLabel>
          <h2 className="mt-8 font-serif text-5xl leading-[0.95] text-balance md:text-7xl">
            Want to be a <span className="italic">closer?</span> Sign the retainer.
          </h2>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/70">
            Recruitment for the 2026–27 associate class is open. No résumé required, no Harvard
            degree checked. Just bring curiosity and a laptop that can run Docker.
          </p>
          <dl className="mt-12 space-y-4 font-mono text-sm">
            <div className="flex gap-6 border-b border-ink/15 pb-4">
              <dt className="w-28 text-ink/50">Chambers</dt>
              <dd>Lab 42, Block C, 2nd Floor</dd>
            </div>
            <div className="flex gap-6 border-b border-ink/15 pb-4">
              <dt className="w-28 text-ink/50">Hearings</dt>
              <dd>Every Friday, 5:00 PM (deploys forbidden)</dd>
            </div>
            <div className="flex gap-6 border-b border-ink/15 pb-4">
              <dt className="w-28 text-ink/50">Counsel</dt>
              <dd>devops@bennett.edu.in</dd>
            </div>
          </dl>
        </div>

        <div className="relative border border-ink/15 bg-paper p-6 shadow-[8px_8px_0_0_var(--ink)] md:p-10">
          {filed ? (
            <div className="flex min-h-[28rem] flex-col items-center justify-center text-center" role="status">
              <span className="-rotate-6 border-4 border-emerald-700 px-6 py-3 font-mono text-2xl font-bold uppercase tracking-[0.3em] text-emerald-700">
                Filed
              </span>
              <p className="mt-10 font-serif text-4xl">
                Welcome to the firm{filed.name ? `, ${filed.name.split(' ')[0]}` : ''}.
              </p>
              <p className="mt-3 font-mono text-sm text-ink/60">Case No. {filed.caseNo}</p>
              <p className="mt-6 max-w-sm leading-relaxed text-ink/70">
                Your application is on the Managing Partner&apos;s desk. Expect a summons within 48
                hours. Wear something sharp.
              </p>
              <button
                type="button"
                onClick={() => setFiled(null)}
                className="mt-8 font-mono text-xs uppercase tracking-[0.2em] underline underline-offset-4"
              >
                File another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-baseline justify-between border-b border-ink/20 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
                <span>Form R-01 · Retainer Agreement</span>
                <span>Privileged</span>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Full name</span>
                  <input name="name" required autoComplete="name" placeholder="Harvey Specter" className={fieldClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Roll number</span>
                  <input name="roll" required placeholder="21CS042" className={fieldClass} />
                </label>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>College email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@college.edu"
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Year</span>
                  <select name="year" required defaultValue="" className={fieldClass}>
                    <option value="" disabled>
                      Select year
                    </option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>Final Year</option>
                  </select>
                </label>
              </div>

              <fieldset>
                <legend className={labelClass}>Preferred practice area</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {practices.map((p, i) => (
                    <label key={p} className="cursor-pointer">
                      <input
                        type="radio"
                        name="practice"
                        value={p}
                        defaultChecked={i === 0}
                        className="peer sr-only"
                      />
                      <span className="block border border-ink/30 px-3 py-1.5 font-mono text-xs transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:ring-2 peer-focus-visible:ring-ink">
                        {p}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="block">
                <span className={labelClass}>Opening statement</span>
                <textarea
                  name="statement"
                  rows={3}
                  placeholder="Why should the firm take your case?"
                  className={`${fieldClass} resize-none`}
                />
              </label>

              <button
                type="submit"
                className="w-full bg-ink py-5 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-paper transition-colors hover:bg-ink/85"
              >
                Sign &amp; File Retainer
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
