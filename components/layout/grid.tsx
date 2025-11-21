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
        'grid grid-cols-1 gap-4 md:grid-cols-3',
        'auto-rows-[minmax(300px,auto)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

