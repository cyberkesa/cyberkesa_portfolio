export interface CapabilityItem {
  id: string
  name: string
  description: string
}

export interface CapabilityBlock {
  id: string
  title: string
  subtitle: string
  items: CapabilityItem[]
  tools?: string[]
  focus?: string
}

export const CAPABILITIES: CapabilityBlock[] = [
  {
    id: 'visual',
    title: 'VISUAL ENGINEERING',
    subtitle: 'Visual Systems & CGI',
    items: [
      {
        id: 'high-end-retouch',
        name: 'HIGH_FIDELITY_POST_PRODUCTION',
        description: 'Deep retouching, color grading, compositing. Pixel-level work with skin and textures.',
      },
      {
        id: 'ecommerce',
        name: 'E_COMMERCE_VISUAL_STRATEGY',
        description: 'Conversion-focused visual design based on consumption psychology. Maximum CTR.',
      },
      {
        id: 'brand-identity',
        name: 'DIGITAL_PRESENCE_ARCHITECTURE',
        description: 'Comprehensive brand packaging in digital environment. Visual language creation.',
      },
      {
        id: 'editorial',
        name: 'EDITORIAL_DESIGN_SYSTEM',
        description: 'Typography, grids, pre-press engineering.',
      },
    ],
    tools: ['Adobe Creative Suite', 'Figma', 'Stable Diffusion', 'Midjourney', 'Magnific AI'],
    focus: 'High-End Retouch, Editorial, Brand Identity',
  },
  {
    id: 'code',
    title: 'SYSTEM ARCHITECTURE',
    subtitle: 'Full-Stack Product Engineering',
    items: [
      {
        id: 'fullstack',
        name: 'FULL_STACK_PRODUCT_ENGINEERING',
        description: 'End-to-end web applications (from database to button animation).',
      },
      {
        id: 'legacy',
        name: 'LEGACY_FRAMEWORK_AGNOSTIC',
        description: 'Vue.js capable, but choosing React ecosystem for new products.',
      },
      {
        id: 'performance',
        name: 'PERFORMANCE_FORENSIC',
        description: 'Performance autopsy. Web Vitals analysis, bottleneck detection, SEO technical audit. Target: 100/100 Lighthouse.',
      },
    ],
    tools: ['Next.js', 'React', 'TypeScript', 'Go', 'Docker', 'PostgreSQL'],
    focus: 'High-load, Clean Architecture',
  },
  {
    id: 'intelligence',
    title: 'INTELLIGENCE & HYBRID',
    subtitle: 'AI + Strategy',
    items: [
      {
        id: 'generative',
        name: 'GENERATIVE_ART_DIRECTION',
        description: 'Content synthesis. Creating unique web assets via neural networks (backgrounds, textures, 3D objects) not available on stock.',
      },
      {
        id: 'design-systems',
        name: 'DESIGN_SYSTEMS_ENGINEERING',
        description: 'Transforming Figma mockups into living component libraries (Storybook). Reusable everywhere.',
      },
      {
        id: 'micro-interactions',
        name: 'MICRO_INTERACTIONS_PHYSICS',
        description: 'Creating interfaces that feel tactile. Physics-based interactions.',
      },
    ],
    tools: ['AI Agents', 'Cursor', 'n8n', 'Framer Motion'],
    focus: 'AI Automation, Audit, Conversion',
  },
]

