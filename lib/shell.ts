// Terminal commands for the Deposition section.
// runCommand is a plain function: text in, output lines out. The only side effect is `deploy`,
// which fires the same window event the command palette uses to start the Motion to Deploy pipeline.
import { allPartners, emitFirmEvent, firmEvents } from '@/lib/firm-data'

export type Tone = 'in' | 'out' | 'ok' | 'err' | 'gold' | 'dim'
export type OutputLine = { tone: Tone; text: string }

export const commandNames = [
  'help',
  'whoami',
  'ls',
  'cat mission.md',
  'kubectl get partners',
  'kubectl describe partner',
  'git log',
  'git blame',
  'uptime',
  'deploy',
  'quote',
  'objection',
  'sudo hire-me',
  'history',
  'clear',
  'exit',
]

const quotes = [
  '"I don\'t get lucky. I make my own luck." — Harvey Specter',
  '"When you\'re backed against the wall, break the goddamn thing down." — Harvey Specter',
  '"You just got Litt up!" — Louis Litt',
  '"I\'m Donna. I know everything." — Donna Paulsen',
  '"Winners don\'t make excuses when the other side plays the game." — Harvey Specter',
]

export const quickCommands = ['help', 'kubectl get partners', 'git log', 'sudo hire-me', 'deploy']

const pad = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s.padEnd(n))

export function runCommand(input: string, history: string[], mountedAt: number): OutputLine[] | 'clear' {
  const raw = input.trim()
  const cmd = raw.toLowerCase()
  const out = (text: string, tone: Tone = 'out') => ({ tone, text })

  if (cmd === '') return []
  if (cmd === 'clear') return 'clear'

  if (cmd === 'help')
    return [
      out('Available motions:', 'gold'),
      out('  whoami                      identify yourself to the court'),
      out('  ls / cat mission.md         read the firm charter'),
      out('  kubectl get partners        list every partner on the door'),
      out('  kubectl describe partner X  pull a partner file (e.g. specter)'),
      out('  git log / git blame         recent firm history'),
      out('  deploy                      file a live motion to deploy'),
      out('  quote / objection / uptime  courtroom utilities'),
      out('  sudo hire-me                you know you want to'),
      out('  history / clear             housekeeping'),
      out('Tip: Tab autocompletes, ↑/↓ scroll history.', 'dim'),
    ]

  if (cmd === 'whoami') return [out('guest@specter-ops — associate candidate (unverified)'), out('Clearance: read-only. Ambition: pending review.', 'dim')]

  if (cmd === 'ls') return [out('mission.md   partners/   case-files/   closing-argument.sh   .secrets (denied)')]

  // 'cat ' with the space, so a command like "catalog" doesn't count as cat
  if (cmd === 'cat' || cmd.startsWith('cat ')) {
    const file = cmd.replace('cat', '').trim()
    if (file === 'mission.md')
      return [
        out('# Specter & Ops — Mission', 'gold'),
        out('1. We automate what others do by hand.'),
        out('2. We ship on Fridays because our pipelines let us.'),
        out('3. We write postmortems, not excuses.'),
        out('4. Every member leaves with a production system on their résumé.'),
      ]
    if (file === '.secrets') return [out('Permission denied. Every secret gets a vault. — I. Hardman', 'err')]
    return [out(`cat: ${file || '(missing operand)'}: No such file. Try "cat mission.md".`, 'err')]
  }

  if (cmd === 'kubectl get partners' || cmd === 'kubectl get pods')
    return [
      out(`${pad('NAME', 18)}${pad('ROLE', 22)}${pad('ALIAS', 18)}RECORD`, 'dim'),
      ...allPartners.map((p) => out(`${pad(p.name, 18)}${pad(p.role, 22)}${pad(p.alias, 18)}${p.record}`, 'ok')),
      out(`${allPartners.length}/${allPartners.length} partners Running · 0 restarts`, 'gold'),
    ]

  if (cmd.startsWith('kubectl describe partner')) {
    const q = cmd.replace('kubectl describe partner', '').trim()
    if (!q) return [out('usage: kubectl describe partner <name>  (e.g. litt)', 'err')]
    // Match the start of any word in the name, so "litt" and "rohan" both find Rohan Litt
    const p = allPartners.find((x) =>
      x.name.toLowerCase().split(' ').some((w) => w.startsWith(q)),
    )
    if (!p) return [out(`Error: partner "${q}" not found. They may have been disbarred.`, 'err')]
    return [
      out(`Name:     ${p.name}`, 'gold'),
      out(`Title:    ${p.title} — ${p.role}`),
      out(`Alias:    ${p.alias}`),
      out(`Year:     ${p.year}`),
      out(`Stack:    ${p.stack.join(', ')}`),
      out(`Record:   ${p.record} (prod incidents)`),
      out(`Quote:    "${p.quote}"`, 'dim'),
    ]
  }

  if (cmd === 'git log')
    return [
      out('a1f9c3e  feat: K8s bootcamp — 180 associates onboarded', 'ok'),
      out('7e02b1d  fix: hackathon infra survived 9k req/s', 'ok'),
      out('c44d8aa  chore: migrated club site to GitOps', 'ok'),
      out('0b7f12e  docs: postmortem for "The Great DNS Outage"', 'ok'),
      out('9d3e6f1  init: Specter & Ops founded, one Raspberry Pi', 'dim'),
    ]

  if (cmd === 'git blame') return [out('Every line: Rohan Litt. He insists on the credit.', 'gold')]

  if (cmd === 'uptime') {
    const seconds = Math.floor((Date.now() - mountedAt) / 1000)
    return [out(`You've been in session ${Math.floor(seconds / 60)}m ${seconds % 60}s · firm SLA 99.99% · load: associates`, 'ok')]
  }

  if (cmd === 'deploy' || cmd === './closing-argument.sh') {
    emitFirmEvent(firmEvents.fileMotion)
    return [out('Motion filed. Proceeding to Exhibit A — watch the pipeline…', 'gold')]
  }

  if (cmd === 'quote') return [out(quotes[Math.floor(Math.random() * quotes.length)], 'gold')]

  if (cmd === 'objection') return [out('Overruled.', 'gold'), out('(Nice try though.)', 'dim')]

  if (cmd === 'sudo hire-me')
    return [
      out('[sudo] password for associate: ********', 'dim'),
      out('Verifying credentials… portfolio [ok]  urgency [ok]  pipeline instincts [ok]', 'ok'),
      out('ACCESS GRANTED. Harvey wants you in his office. Now.', 'gold'),
    ]

  if (cmd.startsWith('sudo')) return [out("Nice try. You're not a name partner.", 'err')]

  if (cmd.startsWith('rm -rf')) return [out('OBJECTION! Sustained. The court will not allow this.', 'err')]

  if (cmd === 'history') return history.length ? history.map((h, i) => out(`${String(i + 1).padStart(4)}  ${h}`, 'dim')) : [out('No prior testimony.', 'dim')]

  if (cmd === 'exit') return [out("You don't walk out on Harvey Specter.", 'err')]

  return [out(`command not found: ${raw}. Type "help". Harvey doesn't guess — he knows.`, 'err')]
}

export const banner: OutputLine[] = [
  { tone: 'gold', text: 'SPECTER & OPS — Deposition Shell v2.6' },
  { tone: 'dim', text: 'You are now under oath. Type "help" to see what you can ask.' },
]
