'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { accessLevels } from '@/config/services'
import { Button } from '@/components/ui/button'

export function ServicesSection() {
  const t = useTranslations('services')
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null)

  const getHoverColor = (level: number) => {
    switch (level) {
      case 1:
        return 'rgba(239, 68, 68, 0.1)' // Red (Warning/Alert)
      case 2:
        return 'rgba(6, 182, 212, 0.1)' // Cyan (Speed/Tech)
      case 3:
        return 'rgba(139, 92, 246, 0.1)' // Purple (Luxury)
      default:
        return 'rgba(255, 255, 255, 0.05)'
    }
  }

  const getButtonText = (level: number) => {
    switch (level) {
      case 1:
        return t('buttonInitiate')
      case 2:
        return t('buttonStart')
      case 3:
        return t('buttonBuild')
      default:
        return t('buttonContact')
    }
  }

  return (
    <section id="services" className="py-24">
      <motion.div
        className="container mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeInUp} className="mb-12 text-center">
          <h2 className="mb-4 font-mono text-3xl font-bold md:text-4xl">
            {t('title')}
          </h2>
          <p className="font-mono text-sm text-foreground/70">{t('subtitle')}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {accessLevels.map((level, index) => (
            <motion.div
              key={level.id}
              variants={fadeInUp}
              onHoverStart={() => setHoveredLevel(level.level)}
              onHoverEnd={() => setHoveredLevel(null)}
              className="group relative overflow-hidden rounded-lg border border-accent bg-accent/30 p-8 backdrop-blur-sm transition-all"
              style={{
                borderColor:
                  hoveredLevel === level.level
                    ? level.level === 1
                      ? 'rgba(239, 68, 68, 0.3)'
                      : level.level === 2
                        ? 'rgba(6, 182, 212, 0.3)'
                        : 'rgba(139, 92, 246, 0.3)'
                    : undefined,
              }}
            >
              {/* Large Background Number */}
              <div
                className="absolute -right-4 -top-4 font-mono text-[120px] font-bold leading-none text-foreground/5 select-none pointer-events-none"
                style={{
                  opacity: hoveredLevel === level.level ? 0.1 : 0.05,
                }}
              >
                {String(level.level).padStart(2, '0')}
              </div>

              {/* Hover Color Overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: hoveredLevel === level.level ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  background: getHoverColor(level.level),
                }}
              />

              <div className="relative z-10">
                {/* Level Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-foreground/50 uppercase tracking-widest">
                    {t('levelLabel')} {level.level}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 font-mono text-2xl font-bold uppercase tracking-wider">
                  {level.title}
                </h3>
                <p className="mb-4 font-mono text-sm text-cyan-400 uppercase tracking-widest">
                  {level.subtitle}
                </p>

                {/* Description */}
                <p className="mb-6 font-mono text-sm text-foreground/70 leading-relaxed">
                  {level.description}
                </p>

                {/* Features */}
                <ul className="mb-6 space-y-2">
                  {level.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 font-mono text-xs text-foreground/60"
                    >
                      <span className="mt-1 text-cyan-400">▸</span>
                      <span className="uppercase tracking-wide">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full font-mono text-xs uppercase tracking-widest border-foreground/20 hover:border-cyan-400 hover:text-cyan-400"
                    onClick={() => {
                      const element = document.querySelector('#contact')
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    {getButtonText(level.level)}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

