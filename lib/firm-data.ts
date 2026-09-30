import type { Partner } from '@/components/site/partner-card'

export const FIRM_EMAIL = 'devops@bennett.edu.in'

export const namePartners: Partner[] = [
  {
    name: 'Quandale Dingle',
    title: 'Managing Partner',
    role: 'President',
    alias: 'The Closer',
    year: 'Final Year · CSE',
    quote: "I don't play the odds. I play the pipeline.",
    stack: ['Kubernetes', 'ArgoCD', 'AWS'],
    record: '37-4',
  },
  {
    name: 'Meera Pearson',
    title: 'Name Partner',
    role: 'Vice President',
    alias: 'The Chairwoman',
    year: 'Final Year · IT',
    quote: 'This is my firm. And my cluster.',
    stack: ['Terraform', 'GCP', 'Vault'],
    record: '38–1',
  },
]

export const seniorPartners: Partner[] = [
  {
    name: 'Rohan Litt',
    title: 'Senior Partner',
    role: 'Tech Lead · CI/CD',
    alias: 'The Linter',
    year: '3rd Year · CSE',
    quote: 'You just got Linted.',
    stack: ['GitHub Actions', 'Jenkins', 'Go'],
    record: '29–3',
  },
  {
    name: 'Zara Paulsen',
    title: 'Senior Partner',
    role: 'Operations Head',
    alias: 'The Gatekeeper',
    year: '3rd Year · ECE',
    quote: "I'm on-call. I know everything.",
    stack: ['Prometheus', 'Grafana', 'Linux'],
    record: '31–2',
  },
  {
    name: 'Kabir Ross',
    title: 'Senior Partner',
    role: 'Cloud Lead',
    alias: 'The Memory',
    year: '3rd Year · CSE',
    quote: 'Read the man page once. Never forgot it.',
    stack: ['AWS', 'Docker', 'Python'],
    record: '27–2',
  },
  {
    name: 'Ananya Zane',
    title: 'Senior Partner',
    role: 'Design & Outreach',
    alias: 'The Counsel',
    year: '3rd Year · IT',
    quote: 'Good docs win cases before they start.',
    stack: ['Figma', 'Next.js', 'Docs-as-Code'],
    record: '24–1',
  },
]

export const associates: Partner[] = [
  {
    name: 'Ishaan Hardman',
    title: 'Associate',
    role: 'Security',
    alias: 'The Auditor',
    year: '2nd Year · CSE',
    quote: 'Every secret gets a vault.',
    stack: ['Trivy', 'OPA', 'Vault'],
    record: '12–0',
  },
  {
    name: 'Diya Cahill',
    title: 'Associate',
    role: 'Events',
    alias: 'The Prosecutor',
    year: '2nd Year · ECE',
    quote: 'Deadlines are not suggestions.',
    stack: ['Ansible', 'Bash', 'Notion'],
    record: '15–1',
  },
  {
    name: 'Vivaan Gibbs',
    title: 'Associate',
    role: 'SRE',
    alias: 'The Fixer',
    year: '2nd Year · IT',
    quote: 'Chaos is a ladder. Also a test.',
    stack: ['Chaos Mesh', 'k6', 'Rust'],
    record: '10–0',
  },
  {
    name: 'Saanvi Bennett',
    title: 'Associate',
    role: 'Content',
    alias: 'The Stenographer',
    year: '2nd Year · CSE',
    quote: 'If it is not in the postmortem, it did not happen.',
    stack: ['Markdown', 'Hugo', 'Git'],
    record: '14–0',
  },
]

export const allPartners: Partner[] = [...namePartners, ...seniorPartners, ...associates]

export const firmEvents = {
  openPalette: 'firm:open-palette',
  fileMotion: 'firm:file-motion',
  focusDeposition: 'firm:focus-deposition',
  littUp: 'firm:litt-up',
} as const

export function emitFirmEvent(name: (typeof firmEvents)[keyof typeof firmEvents]) {
  window.dispatchEvent(new CustomEvent(name))
}
