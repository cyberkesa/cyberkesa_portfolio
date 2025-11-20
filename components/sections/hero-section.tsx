'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Terminal } from '@/components/ui/terminal'
import { Button } from '@/components/ui/button'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { ArrowDown } from 'lucide-react'

export function HeroSection() {
  const t = useTranslations('hero')
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const nestedTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const typewriterText = [
    t('initializing'),
    t('loading'),
    t('ready'),
    t('welcome'),
  ]

  useEffect(() => {
    // Clear nested timeout on unmount or dependency change
    if (nestedTimeoutRef.current) {
      clearTimeout(nestedTimeoutRef.current)
      nestedTimeoutRef.current = null
    }

    const currentText = typewriterText[currentIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          nestedTimeoutRef.current = setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % typewriterText.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => {
      clearTimeout(timeout)
      if (nestedTimeoutRef.current) {
        clearTimeout(nestedTimeoutRef.current)
        nestedTimeoutRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayText, currentIndex, isDeleting])

  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-32">
      <motion.div
        className="container mx-auto max-w-4xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp} className="mb-8">
          <Terminal>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-glow">$</span>
                <span className="text-foreground/70">cat portfolio.txt</span>
              </div>
              <div className="mt-4">
                <span className="text-foreground">{displayText}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                  className="ml-1 text-glow"
                >
                  |
                </motion.span>
              </div>
            </div>
          </Terminal>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 font-mono text-4xl font-bold md:text-6xl">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-2xl font-mono text-lg text-foreground/70">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-4"
        >
          <a href="#projects">
            <Button size="lg">{t('viewProjects')}</Button>
          </a>
          <a href="#contact">
            <Button variant="outline" size="lg">{t('getInTouch')}</Button>
          </a>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-16 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="h-6 w-6 text-foreground/50" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

