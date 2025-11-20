export interface AccessLevel {
  id: string
  level: number
  title: string
  subtitle: string
  description: string
  features: string[]
  price?: string
}

export const accessLevels: AccessLevel[] = [
  {
    id: 'audit',
    level: 1,
    title: 'The Audit',
    subtitle: 'Crash Test',
    description: 'I tear apart your current site. Brutal honesty. Performance analysis. UX critique.',
    features: [
      'Full codebase review',
      'Performance audit (Lighthouse 100/100 target)',
      'UX/UI critique report',
      'Security vulnerabilities scan',
      'Ruthless prioritization',
      'Actionable recommendations',
    ],
  },
  {
    id: 'mvp',
    level: 2,
    title: 'The MVP',
    subtitle: 'Fast Launch',
    description: 'Quick startup launch on my AI-powered stack. Modern. Fast. Scalable.',
    features: [
      'Next.js 15 + TypeScript',
      'AI integration (GPT-4, Claude)',
      'Modern UI/UX',
      'Performance optimized',
      'Deployment ready',
    ],
  },
  {
    id: 'architect',
    level: 3,
    title: 'The Architect',
    subtitle: 'Full Cycle',
    description: 'Complete development cycle. Expensive. Deliberate. Flawless.',
    features: [
      'Full-stack architecture',
      'Custom backend (Go/Rust)',
      'Premium design system',
      '3D/WebGL integration',
      'Long-term support',
    ],
  },
]

