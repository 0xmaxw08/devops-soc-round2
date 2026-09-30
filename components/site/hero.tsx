import Image from 'next/image'
import { ArrowDownRight } from 'lucide-react'
import { DocketTerminal } from './docket-terminal'

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-svh items-end overflow-hidden pt-16">
      <Image
        src="/images/hero-office.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[70%_center] opacity-70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-ink/70 to-ink/40 sm:bg-gradient-to-r sm:from-ink sm:via-ink/85 sm:to-ink/20"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/60" />

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-16 md:px-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:pb-24">
        <div>
          <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold sm:tracking-[0.3em]">
            <span className="h-px w-10 bg-gold" />
            The DevOps Society · Bennett University · Est2. 2022 · 42nd Floor
          </p>
          <h1 className="font-serif text-6xl leading-[0.9] text-balance sm:text-7xl lg:text-8xl xl:text-9xl">
            We don&apos;t get lucky.
            <br />
            <span className="italic text-gold">We ship.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Specter &amp; Ops is the campus firm that treats every deployment like a closing argument
            {' — '}rehearsed, automated, and impossible to object to. Pipelines, containers, cloud and
            the fine art of never deploying manually again.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#retain"
              className="bg-gold px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-transform hover:-translate-y-0.5"
            >
              Retain the Firm
            </a>
            <a
              href="#cases"
              className="group flex items-center gap-2 px-2 py-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground"
            >
              Review the docket
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </a>
          </div>
        </div>

        <DocketTerminal />
      </div>
    </section>
  )
}
