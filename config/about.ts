export const aboutConfig = {
  headline: 'Engineering Digital Aesthetics.',
  bioShort: 'I don\'t build websites; I architect digital estates.\nFull-stack developer & Visual perfectionist.\nMy code is cleaner than your conscience.',
  bioLong: {
    background: 'Started in Graphic Design (2016). Evolved into C/C++ (School 21). Mastered the Modern Web (Next.js + AI).',
    philosophy: 'I believe that "good enough" is an insult. I use AI agents to automate the boring stuff so I can focus on what matters: Physics, Typography, and Vibe.',
    currentStatus: 'Obsessed with R3F shaders, building my own backend in Go, and strictly avoiding mediocrity.',
  },
}

export const statusMessages = [
  { status: 'deploying', label: 'Deploying Production', emoji: '🟢' },
  { status: 'gym', label: 'Gym (Leg Day)', emoji: '🟡' },
  { status: 'recharging', label: 'Recharging (Do not disturb)', emoji: '🔴' },
  { status: 'vibecoding', label: 'Vibecoding', emoji: '🟣' },
] as const

export type StatusType = (typeof statusMessages)[number]['status']

