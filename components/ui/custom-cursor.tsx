'use client'

import { useEffect, useState } from 'react'
import { useMousePosition } from '@/hooks/use-mouse-position'

/**
 * CustomCursor - Inverted color cursor with spotlight effect
 * Desktop only - shows custom cursor with mix-blend-mode: difference
 */
export function CustomCursor() {
  const { x, y } = useMousePosition()
  const [isHovering, setIsHovering] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Only show on desktop
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    // Check if hovering over text
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'P' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'H4' ||
        target.tagName === 'H5' ||
        target.tagName === 'H6' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'A' ||
        target.classList.contains('text-foreground')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const relatedTarget = e.relatedTarget as HTMLElement
      
      // Only reset if not moving to another text element
      if (
        !relatedTarget ||
        (relatedTarget.tagName !== 'P' &&
         relatedTarget.tagName !== 'H1' &&
         relatedTarget.tagName !== 'H2' &&
         relatedTarget.tagName !== 'H3' &&
         relatedTarget.tagName !== 'SPAN' &&
         !relatedTarget.classList.contains('text-foreground'))
      ) {
        setIsHovering(false)
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('resize', checkDesktop)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  if (!isDesktop) return null

  return (
    <>
      {/* Custom cursor dot - highest z-index to be always visible */}
      <div
        className="pointer-events-none fixed z-[99999] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground mix-blend-difference transition-transform duration-150 ease-out"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: isHovering
            ? 'translate(-50%, -50%) scale(2)'
            : 'translate(-50%, -50%) scale(1)',
          // Fallback: ensure visibility even if mix-blend-mode doesn't work
          willChange: 'transform',
        }}
      />

      {/* Spotlight effect on text */}
      {isHovering && (
        <div
          className="pointer-events-none fixed z-[99998] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/20 blur-2xl transition-opacity duration-300"
          style={{
            left: `${x}px`,
            top: `${y}px`,
          }}
        />
      )}
    </>
  )
}
