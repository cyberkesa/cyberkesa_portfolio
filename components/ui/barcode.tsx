'use client'

import { cn } from '@/lib/utils'

interface BarcodeProps {
  className?: string
  width?: number
  height?: number
}

/**
 * Fixed barcode pattern for 100% SSR/CSR consistency
 * Pre-computed values ensure exact match between server and client
 */
const BARCODE_PATTERN = [
  2.837, 1.231, 3.567, 2.015, 1.356, 1.726, 3.022, 1.377, 3.061, 1.580,
  3.322, 1.241, 1.854, 2.180, 2.445, 1.366, 1.875, 1.361, 1.170, 2.120
] as const

/**
 * Decorative barcode SVG component
 * Used for technical documentation aesthetic
 * Uses fixed pattern to ensure 100% SSR/CSR consistency
 */
export function Barcode({ className, width = 60, height = 20 }: BarcodeProps) {

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 20"
      className={cn('opacity-40', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {BARCODE_PATTERN.map((barWidth, index) => (
        <rect
          key={index}
          x={index * 3}
          y={0}
          width={barWidth}
          height={height}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

