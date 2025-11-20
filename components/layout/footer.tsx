'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeIn } from '@/lib/animations'
import { ContactForm } from '@/components/ui/contact-form'

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
      <div className="container mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-mono text-2xl font-bold md:text-3xl">
            {t('title')}
          </h2>
          <p className="mb-8 font-mono text-sm text-foreground/70 md:text-base">
            {t('description')}
          </p>
        </div>

        {/* Contact Form with Budget Filter */}
        <ContactForm />

        <div className="mt-16 border-t border-accent pt-8 text-center">
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
