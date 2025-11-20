'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to track scroll progress (0-1)
 * Returns the current scroll progress as a value between 0 and 1
 */
export function useScrollProgress(): number {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      const scrolled = winHeightPx > 0 ? scrollPx / winHeightPx : 0
      setScrollProgress(Math.min(Math.max(scrolled, 0), 1)) // Clamp between 0 and 1
    }

    window.addEventListener('scroll', updateScrollProgress)
    updateScrollProgress() // Initial calculation

    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return scrollProgress
}

