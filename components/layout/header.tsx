'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { fadeIn } from '@/lib/animations'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const scrollProgress = useScrollProgress()

  return (
    <motion.header
      className="fixed top-0 z-50 w-full border-b border-accent bg-background/80 backdrop-blur-md"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <motion.div
          className="text-lg font-bold"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Link href={`/${locale}`} className="font-mono text-foreground">
            cyberkesa
          </Link>
        </motion.div>

        <nav className="hidden md:flex md:items-center md:gap-8">
          <a
            href="#about"
            className="font-mono text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            {t('about')}
          </a>
          <a
            href="#capabilities"
            className="font-mono text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            {t('capabilities')}
          </a>
          <a
            href="#projects"
            className="font-mono text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            {t('projects')}
          </a>
          <a
            href="#stack"
            className="font-mono text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            {t('stack')}
          </a>
          <a
            href="#services"
            className="font-mono text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            {t('access')}
          </a>
          <Link
            href={`/${locale}/log`}
            className="font-mono text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            {t('log')}
          </Link>
          <a
            href="#contact"
            className="font-mono text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            {t('contact')}
          </a>
          <ThemeToggle />
        </nav>

        {/* Mobile: Theme toggle only */}
        <div className="flex md:hidden">
          <ThemeToggle />
        </div>
      </div>

      {/* Scroll progress bar */}
      <div
        className="h-0.5 bg-gradient-to-r from-glow to-glow-soft transition-all duration-150"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </motion.header>
  )
}

