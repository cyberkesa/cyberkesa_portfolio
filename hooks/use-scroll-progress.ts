'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to track scroll progress (0-1)
 * Returns the current scroll progress as a value between 0 and 1
 */
export function useScrollProgress(): number {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      const scrolled = scrollPx / winHeightPx
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', updateScrollProgress)
    updateScrollProgress() // Initial calculation

    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return scrollProgress
}

