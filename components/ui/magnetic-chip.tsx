'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useEffect, useState, MouseEvent } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export interface MagneticChipProps {
  name: string
  category: 'core' | 'visuals' | 'infrastructure' | 'intelligence'
  color?: string
  index: number
  mouseX: number
  mouseY: number
  onHover?: () => void
}

const categoryLabels = {
  core: 'LIB',
  visuals: 'VIS',
  infrastructure: 'INF',
  intelligence: 'AI',
}

/**
 * MagneticChip - Interactive technology chip with magnetic physics
 * Repels from cursor like a magnet, creating zero-gravity effect
 */
export function MagneticChip({
  name,
  category,
  color,
  index,
  mouseX,
  mouseY,
  onHover,
}: MagneticChipProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  
  // Get theme-appropriate color
  const getThemeColor = () => {
    if (!color) return null
    
    // For light theme, adjust very light colors to be more visible
    if (theme === 'light') {
      // White colors become dark gray on light theme
      if (color === '#FFFFFF' || color === '#ffffff') {
        return '#1a1a1a'
      }
      // Very dark colors become lighter
      if (color === '#000000' || color === '#0B0D0E') {
        return '#4a5568'
      }
    }
    
    return color
  }
  
  const themeColor = getThemeColor()

  // Position values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth movement
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  // Calculate repulsion from mouse (throttled with requestAnimationFrame)
  useEffect(() => {
    if (!ref.current) return

    let rafId: number

    const updatePosition = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dx = mouseX - centerX
      const dy = mouseY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Repulsion force (stronger when closer)
      const minDistance = 100
      if (distance < minDistance) {
        const force = (minDistance - distance) / minDistance
        const angle = Math.atan2(dy, dx)

        // Push away from cursor
        x.set(-Math.cos(angle) * force * 30)
        y.set(-Math.sin(angle) * force * 30)
      } else {
        // Return to original position
        x.set(0)
        y.set(0)
      }

      rafId = requestAnimationFrame(updatePosition)
    }

    rafId = requestAnimationFrame(updatePosition)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [mouseX, mouseY, x, y])

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover?.()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      style={{
        x: xSpring,
        y: ySpring,
        ...(isHovered && themeColor
          ? {
              borderColor: `${themeColor}60`,
              boxShadow: `0 0 20px ${themeColor}30`,
            }
          : {}),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative cursor-pointer select-none',
        'rounded-md border border-foreground/10',
        'bg-accent/40 backdrop-blur-md',
        'px-4 py-2.5 font-mono text-xs',
        'transition-all duration-300',
        'hover:border-foreground/30 hover:bg-accent/60',
        isHovered && 'scale-110 shadow-lg',
        'will-change-transform' // Optimize for transforms
      )}
    >
      {/* Content wrapper - prevents text blur during transform */}
      <div className="relative z-10" style={{ transform: 'translateZ(0)' }}>
        {/* Category label */}
        <div className="mb-1 text-[10px] text-foreground/40 uppercase tracking-wider">
          {categoryLabels[category]}
        </div>

        {/* Tech name */}
        <div
          className={cn(
            'transition-colors',
            'text-foreground/80',
            isHovered && 'text-foreground'
          )}
          style={isHovered && themeColor ? { color: themeColor } : {}}
        >
          {name}
        </div>
      </div>

      {/* Glow effect on hover */}
      {isHovered && themeColor && (
        <motion.div
          className="absolute inset-0 rounded-md opacity-20 blur-md"
          style={{ backgroundColor: themeColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}

