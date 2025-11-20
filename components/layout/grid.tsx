'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Grid({ className, children, ...props }: GridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 auto-rows-[300px] md:grid-cols-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

