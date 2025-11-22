'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

/**
 * SwipeHint - Ghost Signal hint for mobile menu gesture
 * Heavy Luxury / Code Noir aesthetic - technical projection/hologram style
 * Shows pulsing arrow with technical text, disappears after 5s or on scroll
 */
export function SwipeHint({ isMenuOpen }: { isMenuOpen: boolean }) {
  const [isVisible, setIsVisible] = useState(true)
  const t = useTranslations('mobileNav')

  useEffect(() => {
    // Don't show hint if menu is already open
    if (isMenuOpen) {
      setIsVisible(false)
      return
    }

    // 1. Disappear after 5 seconds automatically
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    // 2. Hide on scroll to avoid annoying user
    const handleScroll = () => setIsVisible(false)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMenuOpen])

  // Reset visibility when menu closes (for smooth return animation)
  useEffect(() => {
    if (!isMenuOpen && !isVisible) {
      // Show hint again briefly when menu closes, then hide after 2s
      // This gives user a chance to see the hint again after closing menu
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isMenuOpen, isVisible])

  return (
    <AnimatePresence>
      {isVisible && !isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex flex-col items-center gap-2 pointer-events-none z-50"
          style={{ transform: 'translateX(-50%)' }}
        >
          {/* Hint text (Technical style) */}
          <motion.span
            className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('swipeHint') || '[ ACCESS ]'}
          </motion.span>

          {/* Animated arrow */}
          <motion.div
            animate={{
              y: [0, -8, 0], // Up-down movement
              opacity: [0.5, 1, 0.5], // Pulsation
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-white/80 flex items-center justify-center"
          >
            <ChevronUp size={20} strokeWidth={1.5} />
          </motion.div>

          {/* Decorative line (connection to pill) */}
          <motion.div className="w-[1px] h-4 bg-gradient-to-t from-white/20 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

