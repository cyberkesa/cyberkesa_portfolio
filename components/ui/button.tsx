'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { hoverGlow } from '@/lib/animations'
import { forwardRef } from 'react'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow disabled:pointer-events-none disabled:opacity-50 cursor-pointer'

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
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        variants={hoverGlow}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }

