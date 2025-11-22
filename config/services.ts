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
    title: 'THE AUDIT',
    subtitle: 'Forensic Analysis',
    description: 'I perform an autopsy on your current product. Identifying bottlenecks, technical debt, and conversion killers. Brutal honesty only.',
    features: [
      'Codebase Autopsy',
      'Performance Surgery (100/100 Target)',
      'UX Friction Analysis',
      'Vulnerability Forensics',
      'Ruthless Prioritization',
      'Recovery Roadmap',
    ],
  },
  {
    id: 'mvp',
    level: 2,
    title: 'THE MVP',
    subtitle: 'Velocity Launch',
    description: 'Turning ideas into market-ready assets in record time using my AI-orchestrated pipeline. Scalable foundation from Day 1.',
    features: [
      'Next.js 15 / React Server Components',
      'AI-Agent Architecture',
      'High-Conversion Interface',
      'Zero-Legacy Foundation',
      'Instant Production Deploy',
    ],
  },
  {
    id: 'architect',
    level: 3,
    title: 'THE ARCHITECT',
    subtitle: 'Digital Estate',
    description: 'Bespoke engineering for high-load ambitions. Complete development cycle with no compromises. Expensive. Deliberate. Flawless.',
    features: [
      'Microservice / Monolith Architecture',
      'High-Performance Backend (Go)',
      'Immersive WebGL / R3F Physics',
      'Proprietary Design System',
      'Lifecycle Management',
    ],
  },
]

