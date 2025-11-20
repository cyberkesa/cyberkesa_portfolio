'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export function AboutSection() {
  const t = useTranslations('about')

  return (
    <section id="about" className="py-24">
      <motion.div
        className="container mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={fadeInUp}
          className="mb-12 text-center font-mono text-3xl font-bold md:text-4xl"
        >
          {t('headline')}
        </motion.h2>

        <motion.div
          variants={fadeInUp}
          className="mx-auto max-w-3xl space-y-8"
        >
          {/* Short Bio */}
          <div className="rounded-lg border border-accent bg-accent/30 p-8 backdrop-blur-sm">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">
              {t('bioShort')}
            </pre>
          </div>

          {/* Long Bio */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-mono text-lg font-bold text-glow">
                Background:
              </h3>
              <p className="font-mono text-sm text-foreground/70">
                {t('background')}
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-lg font-bold text-glow">
                Philosophy:
              </h3>
              <p className="font-mono text-sm text-foreground/70">
                {t('philosophy')}
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-lg font-bold text-glow">
                Current Status:
              </h3>
              <p className="font-mono text-sm text-foreground/70">
                {t('currentStatus')}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

