import { SiteHeader } from '@/components/site/site-header'
import { Hero } from '@/components/site/hero'
import { QuoteTicker } from '@/components/site/quote-ticker'
import { TheBrief } from '@/components/site/the-brief'
import { PracticeAreas } from '@/components/site/practice-areas'
import { CaseFiles } from '@/components/site/case-files'
import { MotionToDeploy } from '@/components/site/motion-to-deploy'
import { Partners } from '@/components/site/partners'
import { Deposition } from '@/components/site/deposition'
import { Retainer } from '@/components/site/retainer'
import { SiteFooter } from '@/components/site/site-footer'
import { CommandPalette } from '@/components/site/command-palette'
import { CursorTracker } from '@/components/site/cursor-tracker'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <QuoteTicker />
        <TheBrief />
        <PracticeAreas />
        <CaseFiles />
        <MotionToDeploy />
        <Partners />
        <Deposition />
        <Retainer />
      </main>
      <SiteFooter />
      <CommandPalette />
      <CursorTracker />
    </>
  )
}
