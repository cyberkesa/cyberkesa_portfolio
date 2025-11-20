'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeIn } from '@/lib/animations'
import { ContactForm } from '@/components/ui/contact-form'
import { Mail, MessageCircle } from 'lucide-react'
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

        {/* Direct Contact Links */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a href="mailto:cyberkesa@mail.ru">
            <Button variant="outline" size="lg" className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              cyberkesa@mail.ru
            </Button>
          </a>
          <a href="https://t.me/st3qt" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Telegram
            </Button>
          </a>
        </div>

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
