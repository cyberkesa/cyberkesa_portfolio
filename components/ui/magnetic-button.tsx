'use client'

import { motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion'
import { useRef, MouseEvent } from 'react'
import { cn } from '@/lib/utils'

export interface MagneticButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * MagneticButton - Button with magnetic physics effect
 * Creates tactile resistance when moving cursor away
 * Uses spring physics for heavy luxury feel
 */
export function MagneticButton({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  // Mouse coordinates relative to button center
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics (Heavy Luxury Physics)
  // stiffness: rigidity, damping: damping (lower = more "jelly")
  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return

    const { clientX, clientY } = e
    const rect = ref.current.getBoundingClientRect()
    
    // Prevent division by zero
    if (rect.width === 0 || rect.height === 0) return

    const { height, width, left, top } = rect

    // Calculate offset from center
    const centerX = left + width / 2
    const centerY = top + height / 2

    // Magnetize button to cursor (divide by 2 so button doesn't run away too far)
    x.set((clientX - centerX) / 2)
    y.set((clientY - centerY) / 2)
  }

  const handleMouseLeave = () => {
    // Return to place on leave
    x.set(0)
    y.set(0)
  }

  const baseStyles =
    'relative rounded-md font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow disabled:pointer-events-none disabled:opacity-50 cursor-pointer overflow-hidden group'

  const variants = {
    default:
      'bg-accent text-foreground hover:bg-accent-hover border border-accent-hover',
    outline:
      'border border-accent text-foreground hover:bg-accent hover:border-glow-soft',
    ghost: 'text-foreground hover:bg-accent',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-13 px-8 text-lg',
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {/* Text can also move, but slightly more for parallax effect */}
      <span className="relative z-10 group-hover:text-glow transition-colors duration-300">
        {children}
      </span>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-glow-soft translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
    </motion.button>
  )
}

