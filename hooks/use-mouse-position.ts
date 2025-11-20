'use client'

import { useEffect, useState } from 'react'

interface MousePosition {
  x: number
  y: number
}

/**
 * Hook to track mouse position
 * Returns current mouse coordinates { x, y }
 * Used for glow effects and cursor interactions
 */
export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return mousePosition
}

