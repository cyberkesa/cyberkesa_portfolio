export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  category?: string
  algorithm?: string
  database?: string
  status?: string
  metrics?: {
    performance?: string
    latency?: string
    [key: string]: string | undefined
  }
  link?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'sea-battle',
    title: 'Sea Battle',
    description: 'Classic mechanics reimagined through Heavy Luxury UX/UI. Real-time multiplayer architecture with WebSocket integration.',
    category: 'GAME / UX',
    tech: ['Next.js', 'Framer Motion', 'TypeScript', 'WebSocket'],
    algorithm: 'REALTIME_MULTIPLAYER',
    status: 'PRODUCTION',
    metrics: {
      performance: '98/100',
      latency: '12ms',
      'concurrent users': '500+',
    },
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    description: 'Recursive showcase. The site showcasing itself. Full-stack architecture with internationalization and theme support.',
    category: 'PORTFOLIO / META',
    tech: ['Next.js 15', 'R3F', 'Framer Motion', 'i18n', 'TypeScript'],
    algorithm: 'SSG_OPTIMIZED',
    status: 'PRODUCTION',
    metrics: {
      performance: '100/100',
      latency: '8ms',
      'lighthouse score': '100',
    },
  },
  {
    id: 'fluid-shader',
    title: 'Liquid Shader',
    description: 'GPU-accelerated fluid dynamics using GLSL shaders. Real-time WebGL rendering with interactive mouse tracking.',
    category: 'VISUAL / WEBGL',
    tech: ['Three.js', 'GLSL', 'R3F', 'WebGL'],
    algorithm: 'PERLIN_NOISE',
    status: 'PROTOTYPE',
    metrics: {
      performance: '60 FPS',
      'gpu usage': '45%',
    },
  },
]

