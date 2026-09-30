import { Monogram } from './monogram'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <p className="font-serif text-[13vw] leading-none tracking-tight text-foreground/10 md:text-[12rem]" aria-hidden="true">
          Specter &amp; <span className="italic">Ops</span>
        </p>
        <div className="mt-10 flex flex-col justify-between gap-8 border-t border-border pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Monogram className="size-10" />
            <div>
              <p className="font-serif text-xl">The DevOps Society</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Attorneys at Deploy · Since 2022
              </p>
            </div>
          </div>
          <ul className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <li><a href="#" className="hover:text-gold">GitHub</a></li>
            <li><a href="#" className="hover:text-gold">Instagram</a></li>
            <li><a href="#" className="hover:text-gold">LinkedIn</a></li>
            <li><a href="#" className="hover:text-gold">Discord</a></li>
          </ul>
        </div>
        <p className="mt-8 font-mono text-[11px] text-muted-foreground">
          © 2026 Specter &amp; Ops · A DevOps Society (Bennett University) project · Built by Manvendra (max) · All data is dummy.
        </p>
      </div>
    </footer>
  )
}
