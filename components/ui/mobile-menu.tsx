'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'
import { useDeviceOrientation } from '@/hooks/use-device-orientation'
import { cn } from '@/lib/utils'
import { X, ChevronUp } from 'lucide-react'

/**
 * MobileMenu - Glass Stack navigation
 * Heavy Luxury / Code Noir aesthetic
 * Swipe up to access menu with glass cards stack
 */
export function MobileMenu() {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [dragY, setDragY] = useState(0)
  
  const t = useTranslations('nav')
  const tMobile = useTranslations('mobileNav')
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const { lightTap, mediumTap, heavyTap } = useHapticFeedback()
  const orientation = useDeviceOrientation()
  
  const y = useMotionValue(0)
  const mainContentRef = useRef<HTMLElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
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
  
  // Get main content ref
  useEffect(() => {
    if (typeof document === 'undefined') return
    mainContentRef.current = document.querySelector('main')
  }, [])
  
  // Menu items - memoized to prevent recreation on each render
  const menuItems = useMemo(() => [
    { key: 'home', href: `/${locale}`, label: t('home') },
    { key: 'about', href: `/${locale}#about`, label: t('about') },
    { key: 'projects', href: `/${locale}#projects`, label: t('projects') },
    { key: 'stack', href: `/${locale}#stack`, label: t('stack') },
    { key: 'access', href: `/${locale}#access`, label: t('access') },
    { key: 'log', href: `/${locale}/log`, label: t('log') },
    { key: 'contact', href: `/${locale}#contact`, label: t('contact') },
  ], [locale, t])
  
  // Handle drag end
  const handleDragEnd = (_event: any, info: any) => {
    // Open if dragged up more than 100px or with high velocity
    if (info.offset.y < -100 || info.velocity.y < -500) {
      setIsOpen(true)
      heavyTap()
      y.set(0)
      setDragY(0)
    } else {
      // Return to original position
      y.set(0)
      setDragY(0)
    }
  }
  
  // Apply content transform when menu is open
  useEffect(() => {
    if (!mainContentRef.current) return
    
    const mainContent = mainContentRef.current
    
    if (isOpen) {
      mainContent.style.transform = 'scale(0.85)'
      mainContent.style.filter = 'blur(15px)'
      mainContent.style.transition = 'transform 0.3s ease-out, filter 0.3s ease-out'
    } else {
      mainContent.style.transform = 'scale(1)'
      mainContent.style.filter = 'blur(0px)'
    }
    
    return () => {
      if (mainContent) {
        mainContent.style.transform = ''
        mainContent.style.filter = ''
        mainContent.style.transition = ''
      }
    }
  }, [isOpen])
  
  // Handle menu item click
  const handleMenuItemClick = (href: string, index: number) => {
    lightTap()
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Add delay for visual feedback
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      
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
    }, 200)
  }
  
  // Scroll to top
  const handleScrollToTop = () => {
    mediumTap()
    setIsOpen(false)
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).lenis) {
        ;(window as any).lenis.scrollTo(0, { duration: 1.2 })
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }, 300)
  }
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])
  
  // Calculate parallax offset from gyroscope - memoized
  const getParallaxOffset = useMemo(() => {
    return (index: number) => {
      if (!isOpen || orientation.beta === null || orientation.gamma === null) {
        return { x: 0, y: 0 }
      }
      
      // Subtle parallax effect based on device orientation
      const tiltX = (orientation.gamma / 90) * (index + 1) * 5
      const tiltY = (orientation.beta / 180) * (index + 1) * 5
      
      return {
        x: tiltX,
        y: tiltY,
      }
    }
  }, [isOpen, orientation.beta, orientation.gamma])
  
  if (!isMobile) return null
  
  return (
    <>
      {/* Swipe Up Indicator */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -300, bottom: 0 }}
        dragElastic={0.2}
        onDrag={(_, info) => {
          setDragY(info.offset.y)
          y.set(info.offset.y)
        }}
        onDragEnd={handleDragEnd}
        onDragStart={() => {
          lightTap()
        }}
        style={{ y }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <motion.div
          className={cn(
            'h-16 rounded-full border border-foreground/10 bg-accent/40 backdrop-blur-xl',
            'flex items-center justify-center',
            'transition-all duration-300',
            dragY < -50 && 'border-glow-soft bg-accent/60'
          )}
          animate={{
            scale: dragY < -50 ? 1.05 : 1,
          }}
        >
          <span className="font-mono text-xs text-foreground/60 tracking-widest uppercase">
            {dragY < -50 ? tMobile('releaseToOpen') : tMobile('swipeUpToAccess')}
          </span>
        </motion.div>
      </motion.div>
      
      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md"
              onClick={() => {
                setIsOpen(false)
                mediumTap()
              }}
            />
            
            {/* Glass Stack Menu */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
              }}
              className="fixed inset-0 z-[70] flex flex-col justify-end p-6 pb-24 pointer-events-auto"
            >
              {/* Menu Cards Stack */}
              <div className="space-y-4">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href)
                  const parallaxOffset = getParallaxOffset(index)
                  
                  return (
                    <motion.button
                      key={item.key}
                      initial={{ x: -100, opacity: 0, y: 50 }}
                      animate={{
                        x: 0 + parallaxOffset.x,
                        y: 0 + parallaxOffset.y,
                        opacity: 1,
                      }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{
                        delay: index * 0.1,
                        type: 'spring',
                        damping: 20,
                        stiffness: 100,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMenuItemClick(item.href, index)}
                      className={cn(
                        'w-full rounded-lg border px-8 py-6 text-left',
                        'backdrop-blur-xl transition-all duration-300',
                        'font-mono text-2xl font-bold uppercase tracking-wider',
                        isActive
                          ? 'border-glow bg-glow/20 text-glow shadow-[0_0_30px_rgba(0,255,255,0.3)]'
                          : 'border-foreground/20 bg-foreground/5 text-foreground/80 hover:border-glow/50 hover:bg-foreground/10 hover:text-foreground hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                      )}
                    >
                      {item.label}
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Scroll to Top Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: menuItems.length * 0.1 + 0.1 }}
                onClick={handleScrollToTop}
                className={cn(
                  'mt-8 flex w-full items-center justify-center gap-3 rounded-lg border',
                  'border-foreground/20 bg-foreground/5 px-8 py-6',
                  'font-mono text-lg font-bold uppercase tracking-wider text-foreground/70',
                  'backdrop-blur-xl transition-all duration-300',
                  'hover:border-glow hover:bg-glow/10 hover:text-glow hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                )}
              >
                <ChevronUp className="h-5 w-5" />
                <span>{tMobile('scrollToTop')}</span>
              </motion.button>
              
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: menuItems.length * 0.1 + 0.2 }}
                onClick={() => {
                  setIsOpen(false)
                  mediumTap()
                }}
                className={cn(
                  'mt-4 flex w-full items-center justify-center gap-2 rounded-lg border',
                  'border-foreground/10 bg-foreground/5 px-6 py-4',
                  'font-mono text-sm uppercase tracking-wider text-foreground/50',
                  'backdrop-blur-xl transition-all duration-300',
                  'hover:border-foreground/20 hover:bg-foreground/10 hover:text-foreground/70'
                )}
              >
                <X className="h-4 w-4" />
                <span>{tMobile('closeAccess')}</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
