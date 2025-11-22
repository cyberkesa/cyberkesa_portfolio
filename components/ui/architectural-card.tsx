'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('projectCard')
  const [hovered, setHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const ref = useRef(null)
  const headerRef = useRef<HTMLDivElement>(null) // Ref for header only (stable reference)
  const { lightTap } = useHapticFeedback()
  const hasActivatedRef = useRef(false)
  const isClosingRef = useRef(false) // Prevent rapid open/close cycles
  
  // Detect mobile on mount and resize
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Mobile: Detect when card HEADER (not full card) is in viewport
  // This prevents issues when long cards expand and change page height
  const isHeaderInView = useInView(headerRef, { 
    margin: '-20% 0px -20% 0px', 
    once: false,
    amount: 0.3 // Only need header to be visible
  })
  
  // Mobile: Auto-open on scroll with improved debounce for long cards
  useEffect(() => {
    if (!isMobile) return
    
    let timeoutId: NodeJS.Timeout
    
    // Only open if header is in view and card is not currently closing
    if (isHeaderInView && !hasActivatedRef.current && !isClosingRef.current) {
      // Longer delay to prevent rapid toggling with long cards
      timeoutId = setTimeout(() => {
        if (!isClosingRef.current) {
          lightTap()
          setHovered(true)
          hasActivatedRef.current = true
          isClosingRef.current = false
        }
      }, 150)
    } 
    // Only close if header is completely out of view (not just scrolled past)
    else if (!isHeaderInView && hasActivatedRef.current && !isClosingRef.current) {
      // Longer delay for closing to prevent flickering with long cards
      isClosingRef.current = true
      timeoutId = setTimeout(() => {
        // Double-check header is still out of view before closing
        if (headerRef.current) {
          const rect = headerRef.current.getBoundingClientRect()
          const isStillOutOfView = rect.bottom < 0 || rect.top > window.innerHeight
          
          if (isStillOutOfView) {
            setHovered(false)
            hasActivatedRef.current = false
          }
        }
        isClosingRef.current = false
      }, 300)
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isHeaderInView, isMobile, lightTap])
  
  // Desktop: Hover behavior
  const handleHoverStart = () => {
    if (!isMobile) {
      setHovered(true)
    }
  }

  const handleHoverEnd = () => {
    if (!isMobile) {
      setHovered(false)
    }
  }
  
  // Combined state: hovered on desktop OR hovered on mobile (which is set by isInView)
  // Use hovered state instead of direct isInView to prevent jumping
  const isExpanded = hovered

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

      <div className="relative z-10 flex flex-col py-8 md:py-12 px-6">
        {/* Header Row - use this ref for mobile detection (stable reference point) */}
        <div ref={headerRef} className="flex justify-between items-baseline gap-4">
          <span className="font-mono text-xs text-foreground/50 uppercase tracking-widest flex-shrink-0">
            {t('projectPrefix')}{String(id).padStart(2, '0')}
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
              transition={{ 
                duration: 0.6, 
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.4 }
              }}
              className="overflow-hidden"
            >
              <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-sm">
                {/* Column 1: Core Function / Description */}
                <div className="border-l border-foreground/20 pl-4">
                  <p className="uppercase tracking-widest text-xs text-foreground/50 mb-3">
                    {t('coreFunction')}
                  </p>
                  {description ? (
                    <p className="text-foreground/70 leading-relaxed">{description}</p>
                  ) : (
                    <p className="text-foreground/40 italic">{t('noDescription')}</p>
                  )}

                  {/* Algorithm / Database / Status */}
                  {(algorithm || database || status) && (
                    <div className="mt-6 space-y-2 text-xs">
                      {algorithm && (
                        <div className="flex justify-between">
                          <span className="text-foreground/50">{t('algorithmLabel')}</span>
                          <span className="text-cyan-400">{algorithm}</span>
                        </div>
                      )}
                      {database && (
                        <div className="flex justify-between">
                          <span className="text-foreground/50">{t('databaseLabel')}</span>
                          <span className="text-cyan-400">{database}</span>
                        </div>
                      )}
                      {status && (
                        <div className="flex justify-between">
                          <span className="text-foreground/50">{t('statusLabel')}</span>
                          <span className="text-cyan-400">{status}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Column 2: Stack Trace */}
                <div className="border-l border-foreground/20 pl-4">
                  <p className="uppercase tracking-widest text-xs text-foreground/50 mb-3">
                    {t('stackTrace')}
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
                    {t('metrics')}
                  </p>
                  <div className="space-y-3 text-foreground/70">
                    {metrics?.performance && (
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50">{t('performanceLabel')}</span>
                        <span className="text-cyan-400 font-bold">{metrics.performance}</span>
                      </div>
                    )}
                    {metrics?.latency && (
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50">{t('latencyLabel')}</span>
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
                      <p className="text-foreground/40 italic text-xs">{t('metricsNotAvailable')}</p>
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

