'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'
import { cn } from '@/lib/utils'
import { X, ChevronUp } from 'lucide-react'
import { SwipeHint } from '@/components/ui/swipe-hint'

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
    { key: 'capabilities', href: `/${locale}#capabilities` },
    { key: 'projects', href: `/${locale}#projects` },
    { key: 'stack', href: `/${locale}#stack` },
    { key: 'access', href: `/${locale}#services` }, // Services section uses id="services"
    { key: 'log', href: `/${locale}/log` },
    { key: 'contact', href: `/${locale}#contact` },
  ]
  
  // Scroll to top using Lenis
  const handleScrollToTop = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
      // Smoothly return button to original position
      y.set(0)
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
    // Smoothly return button to original position
    y.set(0)
    
    if (href.includes('#')) {
      // Internal anchor link (format: /${locale}#section)
      const [path, hash] = href.split('#')
      
      // Navigate to route first if needed
      if (path !== pathname) {
        router.push(path)
        // Wait for navigation, then scroll to anchor
        setTimeout(() => {
          const element = document.querySelector(`#${hash}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      } else {
        // Already on the page, just scroll to anchor
        const element = document.querySelector(`#${hash}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else {
      // Route navigation (no anchor)
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
          // Smoothly return button to original position
          y.set(0)
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])
  
  if (!isMobile) return null
  
  return (
    <>
      {/* Up Arrow Button - positioned above language switcher */}
      <motion.div
        data-progress-pill
        className="fixed bottom-24 right-6 z-40"
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
        {/* Swipe Hint - Ghost Signal */}
        <div className="relative w-12 flex justify-center">
          <SwipeHint isMenuOpen={isMenuOpen} />
        </div>
        <motion.button
          onClick={handleScrollToTop}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            'border border-accent bg-accent/80 backdrop-blur-sm',
            'text-foreground/70 transition-all',
            'hover:border-glow-soft hover:bg-accent hover:text-foreground',
            isDragging && 'scale-105',
            isMenuOpen && 'pointer-events-none'
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <ChevronUp className="h-5 w-5" />
          )}
        </motion.button>
        
        {/* Hint text when dragging up */}
        {dragY < -30 && !isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-glow"
          >
            {tMobile('menu')}
          </motion.div>
        )}
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
              onClick={() => {
                setIsMenuOpen(false)
                // Smoothly return button to original position
                y.set(0)
              }}
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
                  onClick={() => {
                    setIsMenuOpen(false)
                    // Smoothly return button to original position
                    y.set(0)
                  }}
                  className="rounded-full p-2 transition-colors hover:bg-foreground/10"
                >
                  <X className="h-5 w-5 text-foreground/70" />
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  // Check if menu item is active
                  let isActive = false
                  if (item.href.includes('#')) {
                    // For anchor links, check if we're on the same path
                    const [path] = item.href.split('#')
                    isActive = pathname === path || pathname.startsWith(path)
                  } else {
                    // For route links, check exact match or starts with
                    isActive = pathname === item.href || pathname.startsWith(item.href)
                  }
                  
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

