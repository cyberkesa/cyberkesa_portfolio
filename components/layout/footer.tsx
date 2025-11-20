'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeIn } from '@/lib/animations'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <motion.footer
      id="contact"
      className="border-t border-accent bg-accent/30"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <h2 className="mb-4 font-mono text-2xl font-bold">{t('title')}</h2>
          <p className="mb-6 text-foreground/70">{t('description')}</p>
          <a href={`mailto:${t('email')}`}>
            <Button size="lg" className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t('email')}
            </Button>
          </a>
        </div>

        <div className="border-t border-accent pt-8 text-center">
          <p className="font-mono text-sm text-foreground/50">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="mt-2 font-mono text-xs text-foreground/30">
            {t('location')}
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
