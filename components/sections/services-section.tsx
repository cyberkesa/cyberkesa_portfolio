'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { accessLevels } from '@/config/services'

export function ServicesSection() {
  const t = useTranslations('services')

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
              className="group relative overflow-hidden rounded-lg border border-accent bg-accent/30 p-8 backdrop-blur-sm transition-all hover:border-glow-soft"
            >
              {/* Level Badge */}
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-foreground/50">
                  {t('levelLabel')} {level.level}
                </span>
                <span className="font-mono text-2xl font-bold text-glow">
                  {level.level}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-2 font-mono text-2xl font-bold">
                {level.title}
              </h3>
              <p className="mb-4 font-mono text-sm text-glow">{level.subtitle}</p>

              {/* Description */}
              <p className="mb-6 font-mono text-sm text-foreground/70">
                {level.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {level.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 font-mono text-xs text-foreground/60"
                  >
                    <span className="mt-1 text-glow">▸</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-glow-soft opacity-0 transition-opacity group-hover:opacity-10" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

