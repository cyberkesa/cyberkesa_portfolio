export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  videoUrl?: string
  imageUrl?: string
  gridSize: 'small' | 'medium' | 'large'
  link?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'sea-battle',
    title: 'Sea Battle Redesign',
    description: 'Classic mechanics reimagined through Heavy Luxury UX/UI.',
    tech: ['Next.js', 'Framer Motion', 'TypeScript'],
    videoUrl: '/videos/seabattle.mp4',
    gridSize: 'large',
    link: 'https://example.com',
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    description: 'Recursive showcase. The site showcasing itself.',
    tech: ['Next.js 15', 'R3F', 'Framer Motion', 'i18n'],
    videoUrl: '/videos/portfolio.mp4',
    gridSize: 'medium',
  },
  {
    id: 'fluid-shader',
    title: 'Liquid Shader',
    description: 'GPU-accelerated fluid dynamics using GLSL shaders.',
    tech: ['Three.js', 'GLSL', 'R3F'],
    videoUrl: '/videos/shader.mp4',
    gridSize: 'medium',
  },
]

