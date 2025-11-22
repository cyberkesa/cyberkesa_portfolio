'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { fadeInUp } from '@/lib/animations'
import { STACK } from '@/config/stack'
import { MagneticChip } from '@/components/ui/magnetic-chip'
import { useMousePosition } from '@/hooks/use-mouse-position'
import { useDeviceOrientation } from '@/hooks/use-device-orientation'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'

export function StackSection() {
  const t = useTranslations('stack')
  const { x: mouseX, y: mouseY } = useMousePosition()
  const orientation = useDeviceOrientation()
  const { lightTap } = useHapticFeedback()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate gravity effect from device orientation (mobile)
  const getGravityOffset = (index: number) => {
    if (!isMobile || orientation.beta === null || orientation.gamma === null) {
      return { x: 0, y: 0 }
    }

    // Convert orientation to screen coordinates
    // beta: -180 to 180 (left/right tilt)
    // gamma: -90 to 90 (front/back tilt)
    // Prevent division by zero (though beta/gamma should never be exactly 0 for division)
    const gamma = orientation.gamma
    const beta = orientation.beta
    
    const tiltX = (gamma / 90) * 50 // Max 50px movement
    const tiltY = (beta / 180) * 50

    // Add some randomness per chip for natural feel
    const randomOffset = Math.sin(index) * 10

    return {
      x: tiltX + randomOffset,
      y: tiltY + randomOffset,
    }
  }

  return (
    <section id="stack" className="relative py-24 min-h-[60vh]">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="mb-16 text-center font-mono text-3xl font-bold md:text-4xl">
          {t('title')}
        </h2>

        {/* Zero Gravity Chips Container */}
        <div className="relative min-h-[400px] md:min-h-[500px]">
          <div className="flex flex-wrap gap-4 justify-center items-start max-w-6xl mx-auto">
            {STACK.map((item, index) => {
              const gravityOffset = getGravityOffset(index)
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -50, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    y: gravityOffset.y,
                    scale: 1,
                    x: gravityOffset.x,
                  }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  onTapStart={() => {
                    if (isMobile) lightTap()
                  }}
                >
                  <MagneticChip
                    name={item.name}
                    category={item.category}
                    color={item.color}
                    index={index}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    onHover={() => {
                      if (isMobile) lightTap()
                    }}
                  />
                </motion.div>
              )
            })}
          </div>

          {/* Category labels (desktop only) */}
          {!isMobile && (
            <div className="mt-12 flex justify-center gap-8 text-xs font-mono text-foreground/30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                {t('categoryCore')}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                {t('categoryVisuals')}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                {t('categoryInfrastructure')}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                {t('categoryIntelligence')}
              </div>
            </div>
          )}

          {/* Mobile hint */}
          {isMobile && (
            <motion.p
              className="mt-8 text-center text-xs font-mono text-foreground/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {t('mobileHint')}
            </motion.p>
          )}
        </div>
      </motion.div>
    </section>
  )
}

