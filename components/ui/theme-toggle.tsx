'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

/**
 * ThemeToggle - Button to switch between dark and light themes
 * Uses View Transitions API for smooth "Ethereal Shift" animation
 * Heavy Luxury / Code Noir aesthetic
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    // 1. Check if browser supports View Transitions API
    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    // 2. Get click coordinates
    const x = e.clientX
    const y = e.clientY

    // 3. Calculate radius to farthest corner (to cover entire screen)
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // 4. Start transition
    const transition = document.startViewTransition(async () => {
      setTheme(newTheme)
      // Wait for next tick so React can apply theme class
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // 5. Animate clip-path (Mask)
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`, // Start: point under cursor
            `circle(${endRadius}px at ${x}px ${y}px)`, // Finish: entire screen
          ],
        },
        {
          duration: 750, // 750ms - slow and "expensive" (usually 300ms)
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)', // Custom curve (Heavy Ease)
          pseudoElement: '::view-transition-new(root)', // Apply to "new" state
        } as KeyframeAnimationOptions
      )
    })
  }

  if (!mounted) {
    return (
      <button
        className="relative h-10 w-10 rounded-full border border-foreground/10 bg-accent/80 backdrop-blur-sm transition-all hover:border-glow-soft hover:bg-accent"
        aria-label="Toggle theme"
        disabled
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Sun className="h-5 w-5 text-foreground/50" />
        </div>
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-full border border-foreground/10 bg-accent/80 backdrop-blur-sm transition-all hover:border-glow-soft hover:bg-accent overflow-hidden group"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {/* Icons with smooth transition inside button */}
      <div className="relative w-5 h-5">
        <Sun className="absolute inset-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground/80" />
        <Moon className="absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground/80" />
      </div>
    </button>
  )
}

