'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface IdCardProps {
  imageSrc: string
  className?: string
}

export function IdCard({ imageSrc, className }: IdCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasImageError, setHasImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Mouse position tracking
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Heavy Luxury Physics
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 })

  // Tilt Effect (3D rotation)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg'])

  // Glare effect (moves opposite to tilt)
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareOpacity = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [0, 0.4]
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    // Prevent division by zero
    if (rect.width === 0 || rect.height === 0) return

    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Normalize coordinates from -0.5 to 0.5 (center = 0)
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    // Return to center when mouse leaves
    x.set(0)
    y.set(0)
  }

  return (
    <div className={cn('perspective-1000', className)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-[320px] h-[480px] bg-black/80 rounded-xl border border-white/10 shadow-2xl cursor-none overflow-hidden group"
      >
        {/* === LAYER 1: PHOTO === */}
        <div className="absolute inset-0 z-0">
          {/* Try Next.js Image first, fallback to img for HEIC */}
          {!hasImageError && imageSrc.toLowerCase().includes('.heic') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt="ID Card"
              className="h-full w-full object-cover grayscale contrast-125 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                // HEIC not supported or file missing
                setHasImageError(true)
              }}
            />
          ) : !hasImageError ? (
            <Image
              src={imageSrc}
              alt="ID Card"
              fill
              className="object-cover grayscale contrast-125 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              priority
              sizes="320px"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setHasImageError(true)
              }}
            />
          ) : (
            // Fallback placeholder when image fails to load
            <div className="h-full w-full bg-gradient-to-br from-accent/60 via-accent/40 to-accent/20 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-5xl font-mono text-foreground/30 select-none">
                  [ID]
                </div>
                <div className="font-mono text-xs text-foreground/50 uppercase tracking-widest">
                  Photo
                </div>
              </div>
            </div>
          )}

          {/* Noise overlay for style */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
        </div>

        {/* === LAYER 2: TECHNICAL DATA (OVERLAY) === */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-between p-6 font-mono text-xs text-white/90 tracking-widest pointer-events-none"
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* Top block */}
          <div className="flex justify-between items-start border-b border-white/20 pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-white/40">ID</span>
              <span className="font-bold">001</span>
            </div>
            {/* Chip icon */}
            <div className="w-8 h-6 border border-white/30 rounded-sm bg-gradient-to-br from-white/10 to-transparent" />
          </div>

          {/* Bottom block */}
          <div className="flex flex-col gap-4 border-t border-white/20 pt-4 bg-black/40 backdrop-blur-sm -mx-6 -mb-6 p-6">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-white/40">CLASS</span>
                <span className="font-bold text-cyan-400/90">ARCHITECT</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-white/40">STATUS</span>
                <div className="flex items-center gap-2 justify-end">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="font-bold">ONLINE</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-white/40">LOC</span>
              <span className="font-bold blur-[2px] hover:blur-none transition-all duration-300">
                [REDACTED]
              </span>
            </div>
          </div>
        </div>

        {/* === LAYER 3: GLARE === */}
        <motion.div
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.3) 0%, transparent 80%)`,
            opacity: glareOpacity,
          }}
          className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay"
        />

        {/* Border frame to emphasize glass effect */}
        <div className="absolute inset-0 z-40 border border-white/10 rounded-xl pointer-events-none" />
      </motion.div>
    </div>
  )
}

