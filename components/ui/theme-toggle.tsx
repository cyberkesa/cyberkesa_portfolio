'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useChaosTheme } from '@/hooks/use-chaos-theme'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme } = useTheme()
  const { triggerThemeSwitch } = useChaosTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-full border border-accent bg-background" />
    )
  }

  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={triggerThemeSwitch}
      className={cn(
        'relative h-8 w-8 rounded-full border border-accent bg-background p-1.5',
        'transition-colors hover:bg-accent',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-glow'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 180,
          opacity: 1,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-foreground" />
        )}
      </motion.div>
    </motion.button>
  )
}

