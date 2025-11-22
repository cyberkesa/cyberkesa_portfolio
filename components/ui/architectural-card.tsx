'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'
import { cn } from '@/lib/utils'

export interface ArchitecturalCardProps {
  id: string
  title: string
  category?: string
  description?: string
  tech: string[]
  algorithm?: string
  database?: string
  status?: string
  metrics?: {
    performance?: string
    latency?: string
    [key: string]: string | undefined
  }
  link?: string
}

export function ArchitecturalCard({
  id,
  title,
  category,
  description,
  tech,
  algorithm,
  database,
  status,
  metrics,
  link,
}: ArchitecturalCardProps) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const { lightTap } = useHapticFeedback()
  const hasActivatedRef = useRef(false)
  
  // Mobile: Detect when card is in center of viewport
  const isInView = useInView(ref, { 
    margin: '-40% 0px -40% 0px', 
    once: false,
    amount: 0.3
  })
  
  // Mobile: Auto-open on scroll
  useEffect(() => {
    if (isInView && !hasActivatedRef.current) {
      lightTap()
      setHovered(true)
      hasActivatedRef.current = true
    } else if (!isInView) {
      hasActivatedRef.current = false
    }
  }, [isInView, lightTap])
  
  // Desktop: Hover behavior
  const handleHoverStart = () => {
    setHovered(true)
  }

  const handleHoverEnd = () => {
    setHovered(false)
  }
  
  // Combined state: hovered on desktop OR inView on mobile
  const isExpanded = hovered || (typeof window !== 'undefined' && window.innerWidth < 768 && isInView)

  const content = (
    <motion.div
      ref={ref}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onMouseLeave={handleHoverEnd}
      className={cn(
        'relative w-full border-b border-foreground/10 bg-accent/30 group cursor-pointer overflow-hidden',
        'transition-all duration-700 ease-out'
      )}
      role="article"
      aria-label={`Project: ${title}`}
    >
      {/* Grid Pattern Background (visible on hover) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Scanning Line Effect */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-0 bottom-0 w-1 bg-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] z-10 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col py-8 md:py-12 px-4 md:px-12">
        {/* Header Row */}
        <div className="flex justify-between items-baseline gap-4">
          <span className="font-mono text-xs text-foreground/50 uppercase tracking-widest flex-shrink-0">
            PROJECT_{String(id).padStart(2, '0')}
          </span>

          <h3
            className={cn(
              'text-4xl md:text-6xl lg:text-8xl font-bold uppercase tracking-tight transition-all duration-500',
              'text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/40',
              'group-hover:from-cyan-400 group-hover:to-cyan-400/60',
              'flex-1 text-center md:text-left'
            )}
          >
            {title}
          </h3>

          {category && (
            <span className="font-mono text-xs text-cyan-400 hidden md:block uppercase tracking-widest flex-shrink-0">
              {category}
            </span>
          )}
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-sm">
                {/* Column 1: Core Function / Description */}
                <div className="border-l border-foreground/20 pl-4">
                  <p className="uppercase tracking-widest text-xs text-foreground/50 mb-3">
                    CORE FUNCTION
                  </p>
                  {description ? (
                    <p className="text-foreground/70 leading-relaxed">{description}</p>
                  ) : (
                    <p className="text-foreground/40 italic">No description available</p>
                  )}

                  {/* Algorithm / Database / Status */}
                  {(algorithm || database || status) && (
                    <div className="mt-6 space-y-2 text-xs">
                      {algorithm && (
                        <div className="flex justify-between">
                          <span className="text-foreground/50">ALGORITHM:</span>
                          <span className="text-cyan-400">{algorithm}</span>
                        </div>
                      )}
                      {database && (
                        <div className="flex justify-between">
                          <span className="text-foreground/50">DATABASE:</span>
                          <span className="text-cyan-400">{database}</span>
                        </div>
                      )}
                      {status && (
                        <div className="flex justify-between">
                          <span className="text-foreground/50">STATUS:</span>
                          <span className="text-cyan-400">{status}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Column 2: Stack Trace */}
                <div className="border-l border-foreground/20 pl-4">
                  <p className="uppercase tracking-widest text-xs text-foreground/50 mb-3">
                    STACK_TRACE
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    {tech.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-cyan-400">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Metrics */}
                <div className="border-l border-foreground/20 pl-4">
                  <p className="uppercase tracking-widest text-xs text-foreground/50 mb-3">
                    METRICS
                  </p>
                  <div className="space-y-3 text-foreground/70">
                    {metrics?.performance && (
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50">Performance:</span>
                        <span className="text-cyan-400 font-bold">{metrics.performance}</span>
                      </div>
                    )}
                    {metrics?.latency && (
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50">Latency:</span>
                        <span className="text-cyan-400 font-bold">{metrics.latency}</span>
                      </div>
                    )}
                    {Object.entries(metrics || {})
                      .filter(([key]) => key !== 'performance' && key !== 'latency')
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-foreground/50 capitalize">{key}:</span>
                          <span className="text-cyan-400 font-bold">{value}</span>
                        </div>
                      ))}
                    {(!metrics || Object.keys(metrics).length === 0) && (
                      <p className="text-foreground/40 italic text-xs">Metrics not available</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Line at Bottom */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        initial={{ width: 0 }}
        animate={{ width: isExpanded ? '100%' : 0 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.div>
  )

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View project: ${title} (opens in new tab)`}
        className="block focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-background"
      >
        {content}
      </a>
    )
  }

  return content
}

