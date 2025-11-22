'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { IdCard } from '@/components/ui/id-card'
import { Barcode } from '@/components/ui/barcode'
import { useTypewriter } from '@/lib/use-typewriter'
import { cn } from '@/lib/utils'

export function AboutSection() {
  const t = useTranslations('about')
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const headlineInView = useInView(headlineRef, { once: true, amount: 0.3 })
  const headlineText = t('headline')
  const { displayText: typedHeadline, isTyping } = useTypewriter(
    headlineInView ? headlineText : '',
    { speed: 30, delay: 300 }
  )

  return (
    <section id="about" className="py-24 relative">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Headline with typewriter effect */}
        <motion.h2
          ref={headlineRef}
          variants={fadeInUp}
          className="mb-12 text-center font-mono text-3xl font-bold md:text-4xl"
        >
          {typedHeadline}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
              className="ml-1"
            >
              |
            </motion.span>
          )}
        </motion.h2>

        <div className="flex flex-col md:flex-row items-start gap-12 lg:gap-16 max-w-6xl mx-auto relative">
          {/* Left column: Technical Documentation Style */}
          <motion.div
            variants={fadeInUp}
            className="flex-1 flex flex-col gap-0 border-l border-foreground/10 pl-8 relative"
          >
            {/* Decorative left border indicator */}
            <div className="absolute left-[-1px] top-0 w-[2px] h-12 bg-foreground" />

            {/* Decorative labels */}
            <div className="absolute top-0 right-0 font-mono text-[10px] text-foreground/30 uppercase tracking-widest">
              [READ_ONLY]
            </div>
            <div className="absolute bottom-0 right-0 font-mono text-[10px] text-foreground/30 uppercase tracking-widest">
              DATA_BLOCK_V1
            </div>

            {/* Barcode decoration */}
            <div className="absolute top-4 right-4">
              <Barcode className="text-foreground/20" />
            </div>

            {/* Block 1: Manifesto */}
            <div className="mb-12 pb-8 border-b border-foreground/10">
              <span className="font-mono text-xs text-foreground/40 mb-2 block tracking-widest uppercase">
                {'// SYSTEM_MANIFESTO'}
              </span>
              <p className="text-lg font-medium leading-relaxed max-w-xl font-mono">
                {t('bioShort').split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < t('bioShort').split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

            {/* Block 2: Technical Details Grid */}
            <div className="grid grid-cols-1 gap-8 pt-8">
              {/* Background Section */}
              <div
                onMouseEnter={() => setHoveredSection('background')}
                onMouseLeave={() => setHoveredSection(null)}
                className="group"
              >
                <h3 className="font-mono text-xs uppercase font-bold mb-2 flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 bg-foreground rounded-full" />
                  01. {t('backgroundLabel').replace(':', '')}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed font-mono">
                  {t('background')}
                </p>
              </div>

              {/* Philosophy Section */}
              <div
                onMouseEnter={() => setHoveredSection('philosophy')}
                onMouseLeave={() => setHoveredSection(null)}
                className="group"
              >
                <h3 className="font-mono text-xs uppercase font-bold mb-2 flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 border border-foreground rounded-full" />
                  02. {t('philosophyLabel').replace(':', '')}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed font-mono">
                  {t('philosophy')}
                </p>
              </div>

              {/* Status Section */}
              <div
                onMouseEnter={() => setHoveredSection('status')}
                onMouseLeave={() => setHoveredSection(null)}
                className="group"
              >
                <h3 className="font-mono text-xs uppercase font-bold mb-2 flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 bg-foreground/20 rounded-full" />
                  03. {t('currentStatusLabel').replace(':', '')}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed font-mono">
                  {t('currentStatus')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Connector line from text to ID card */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />

          {/* Right column: ID Card */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="flex-1 flex justify-center md:justify-end relative"
          >
            {/* Connector line endpoint */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-8 h-px bg-foreground/20 hidden md:block" />
            <IdCard 
              imageSrc="/images/id-card.jpg" 
              className={cn(
                hoveredSection && 'transition-all duration-300',
                hoveredSection === 'background' && 'brightness-110',
                hoveredSection === 'philosophy' && 'brightness-110',
                hoveredSection === 'status' && 'brightness-110'
              )}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

