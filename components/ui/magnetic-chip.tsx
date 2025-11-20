'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useEffect, useState, MouseEvent } from 'react'
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
  const [isHovered, setIsHovered] = useState(false)

  // Position values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth movement
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  // Calculate repulsion from mouse
  useEffect(() => {
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
        ...(isHovered && color
          ? {
              borderColor: `${color}40`,
              boxShadow: `0 0 20px ${color}20`,
            }
          : {}),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative cursor-pointer select-none',
        'rounded-md border border-white/10',
        'bg-black/40 backdrop-blur-md',
        'px-4 py-2.5 font-mono text-xs',
        'transition-all duration-300',
        'hover:border-white/30 hover:bg-black/60',
        isHovered && 'scale-110 shadow-lg'
      )}
    >
      {/* Category label */}
      <div className="mb-1 text-[10px] text-foreground/40 uppercase tracking-wider">
        {categoryLabels[category]}
      </div>

      {/* Tech name */}
      <div
        className={cn(
          'text-foreground/80 transition-colors',
          isHovered && 'text-foreground'
        )}
        style={isHovered && color ? { color } : {}}
      >
        {name}
      </div>

      {/* Glow effect on hover */}
      {isHovered && color && (
        <motion.div
          className="absolute inset-0 rounded-md opacity-20 blur-md"
          style={{ backgroundColor: color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}

