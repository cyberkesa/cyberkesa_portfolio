'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeIn } from '@/lib/animations'
import { TransmissionTerminal } from '@/components/ui/transmission-terminal'
import { Mail, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

async function submitTransmission(data: {
  name: string
  email: string
  message: string
  budget: number
}) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export function Footer() {
  const t = useTranslations('footer')

  return (
    <motion.footer
      className="border-t border-accent bg-accent/30"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <TransmissionTerminal onSubmit={submitTransmission} />

      <div className="container mx-auto px-6 py-8">
        <div className="border-t border-foreground/10 pt-8 text-center">
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
