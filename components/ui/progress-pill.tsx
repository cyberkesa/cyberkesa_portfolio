'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'
import { cn } from '@/lib/utils'
import { X, ChevronUp } from 'lucide-react'

/**
 * ProgressPill - Mobile navigation component
 * Combines scroll progress indicator, menu, and scroll-to-top in one pill
 * Heavy Luxury / Code Noir aesthetic
 */
export function ProgressPill() {
  const [isMobile, setIsMobile] = useState(false)

  const t = useTranslations('nav')
  const tMobile = useTranslations('mobileNav')
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const scrollProgress = useScrollProgress()
  const { lightTap, mediumTap } = useHapticFeedback()
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  
  const y = useMotionValue(0)
  const opacity = useTransform(y, [-200, 0], [1, 0.3])
  
  // Detect mobile
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Menu items
  const menuItems = [
    { key: 'home', href: `/${locale}` },
    { key: 'about', href: `/${locale}#about` },
    { key: 'projects', href: `/${locale}#projects` },
    { key: 'stack', href: `/${locale}#stack` },
    { key: 'access', href: `/${locale}#access` },
    { key: 'log', href: `/${locale}/log` },
    { key: 'contact', href: `/${locale}#contact` },
  ]
  
  // Scroll to top using Lenis
  const handleScrollToTop = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
      return
    }
    
    mediumTap()
    
    // Use Lenis for smooth scroll if available
    if (typeof window !== 'undefined' && (window as any).lenis) {
      ;(window as any).lenis.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }
  
  // Handle drag end
  const handleDragEnd = (_event: any, info: any) => {
    setIsDragging(false)
    
    // If dragged up more than 50px, open menu
    if (info.offset.y < -50) {
      setIsMenuOpen(true)
      mediumTap()
      setDragY(0)
    } else {
      // Return to original position
      y.set(0)
      setDragY(0)
    }
  }
  
  // Handle menu item click
  const handleMenuItemClick = (href: string) => {
    lightTap()
    setIsMenuOpen(false)
    
    if (href.startsWith('#')) {
      // Internal anchor link
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Route navigation
      router.push(href)
    }
  }
  
  // Close menu on outside click
  useEffect(() => {
    if (isMenuOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (!target.closest('[data-progress-pill]')) {
          setIsMenuOpen(false)
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])
  
  if (!isMobile) return null
  
  const progressPercentage = Math.round(scrollProgress * 100)
  
  return (
    <>
      {/* Progress Pill */}
      <motion.div
        data-progress-pill
        className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
        drag="y"
        dragConstraints={{ top: -200, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={() => {
          setIsDragging(true)
          lightTap()
        }}
        onDrag={(_, info) => {
          setDragY(info.offset.y)
        }}
        onDragEnd={handleDragEnd}
        style={{ y, opacity }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={handleScrollToTop}
          className={cn(
            'relative flex h-12 items-center justify-center gap-2 rounded-full',
            'border border-foreground/10 bg-accent/80 backdrop-blur-xl',
            'px-6 font-mono text-xs text-foreground/80',
            'transition-all duration-300',
            'hover:border-foreground/20 hover:bg-accent',
            isDragging && 'scale-105',
            isMenuOpen && 'pointer-events-none'
          )}
          whileHover={{ scale: 1.05 }}
        >
          {/* Progress bar inside pill */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-glow via-glow-soft to-glow"
              style={{
                width: `${scrollProgress * 100}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          {/* Content */}
          <span className="relative z-10 flex items-center gap-2">
            {isMenuOpen ? (
              <>
                <X className="h-4 w-4" />
                <span>{tMobile('close')}</span>
              </>
            ) : (
              <>
                <span className="tabular-nums">{progressPercentage}%</span>
                {dragY < -30 && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-glow"
                  >
                    {tMobile('menu')}
                  </motion.span>
                )}
              </>
            )}
          </span>
        </motion.button>
      </motion.div>
      
      {/* Expanded Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
              }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-foreground/10 bg-accent/95 backdrop-blur-xl p-8"
              data-progress-pill
            >
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-mono text-lg font-bold text-foreground">{tMobile('navigation')}</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-foreground/10"
                >
                  <X className="h-5 w-5 text-foreground/70" />
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href)
                  
                  return (
                    <motion.button
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleMenuItemClick(item.href)}
                      className={cn(
                        'w-full rounded-lg border px-6 py-4 text-left font-mono text-sm transition-all',
                        isActive
                          ? 'border-glow bg-glow/10 text-glow'
                          : 'border-foreground/10 bg-foreground/5 text-foreground/70 hover:border-foreground/20 hover:bg-foreground/10 hover:text-foreground'
                      )}
                    >
                      {t(item.key)}
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Scroll to top button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={handleScrollToTop}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-foreground/10 bg-foreground/5 px-6 py-4 font-mono text-sm text-foreground/70 transition-all hover:border-glow hover:bg-glow/10 hover:text-glow"
              >
                <ChevronUp className="h-4 w-4" />
                <span>{tMobile('scrollToTop')}</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

