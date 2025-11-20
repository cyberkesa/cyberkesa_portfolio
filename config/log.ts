export interface LogEntry {
  id: string
  date: string
  title: string
  excerpt: string
  content: string
  tags: string[]
}

export const logEntries: LogEntry[] = [
  {
    id: '1',
    date: '2025-11-20',
    title: 'Why Modern Interfaces Are Garbage',
    excerpt: 'A rant about the state of UX in 2025.',
    content: 'Full content here...',
    tags: ['ux', 'rant', 'design'],
  },
  {
    id: '2',
    date: '2025-11-18',
    title: 'How I Configured GPT-5 to Write Code for Me',
    excerpt: 'Setting up AI agents to automate the boring stuff.',
    content: 'Full content here...',
    tags: ['ai', 'automation', 'coding'],
  },
  {
    id: '3',
    date: '2025-11-15',
    title: 'The Avocado and Quality Standards Story',
    excerpt: 'A lesson about perfectionism from an avocado.',
    content: 'Full content here...',
    tags: ['philosophy', 'quality', 'story'],
  },
]

