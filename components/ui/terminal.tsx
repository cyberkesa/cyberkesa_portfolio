'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeIn } from '@/lib/animations'

export interface TerminalProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  title?: string
  children?: React.ReactNode
}

export function Terminal({
  title = 'terminal',
  className,
  children,
  ...props
}: TerminalProps) {
  return (
    <motion.div
      className={cn(
        'overflow-hidden rounded-lg border border-accent bg-accent/30 backdrop-blur-sm',
        className
      )}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-accent bg-accent/50 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-2 text-xs font-mono text-foreground/60">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 font-mono text-sm">{children}</div>
    </motion.div>
  )
}

