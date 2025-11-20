'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeInUp } from '@/lib/animations'
import { STACK } from '@/config/stack'

export function StackSection() {
  const t = useTranslations('stack')
  // Duplicate stack for seamless loop
  const duplicatedStack = [...STACK, ...STACK]

  return (
    <section id="stack" className="py-24">
      <motion.div
        className="container mx-auto px-6"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="mb-12 text-center font-mono text-3xl font-bold md:text-4xl">
          {t('title')}
        </h2>

        {/* Marquee container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{
              x: [0, -50 * STACK.length * 10],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 40,
                ease: 'linear',
              },
            }}
          >
            {duplicatedStack.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex-shrink-0 whitespace-nowrap rounded-md border border-accent bg-accent/30 px-6 py-3 font-mono text-sm text-foreground/70 backdrop-blur-sm transition-colors hover:text-foreground"
              >
                {item.name}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

