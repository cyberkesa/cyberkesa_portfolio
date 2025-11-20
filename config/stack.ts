export interface TechStackItem {
  name: string
  category: 'core' | 'visuals' | 'infrastructure' | 'intelligence'
  color?: string
  icon?: string
}

export const STACK: TechStackItem[] = [
  // Core (Фундамент)
  { name: 'Next.js 15', category: 'core', color: '#FFFFFF' }, // Белый для Next.js (их бренд)
  { name: 'TypeScript', category: 'core', color: '#3178C6' },
  { name: 'Go', category: 'core', color: '#00ADD8' },
  
  // Visuals (Эстетика)
  { name: 'React Three Fiber', category: 'visuals', color: '#FF6B6B' },
  { name: 'GLSL Shaders', category: 'visuals', color: '#8B5CF6' },
  { name: 'Framer Motion', category: 'visuals', color: '#0055FF' },
  { name: 'Tailwind CSS', category: 'visuals', color: '#06B6D4' },
  
  // Infrastructure (Инфраструктура)
  { name: 'Docker', category: 'infrastructure', color: '#2496ED' },
  { name: 'PostgreSQL', category: 'infrastructure', color: '#336791' },
  { name: 'Vercel', category: 'infrastructure', color: '#FFFFFF' }, // Белый для Vercel
  { name: 'Railway', category: 'infrastructure', color: '#0EA5E9' }, // Яркий синий вместо черного
  
  // Intelligence (Мозги)
  { name: 'AI Agents', category: 'intelligence', color: '#10B981' },
  { name: 'LLM Integration', category: 'intelligence', color: '#8B5CF6' },
]

