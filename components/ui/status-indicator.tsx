'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { statusMessages, type StatusType } from '@/config/about'
import { useTranslations } from 'next-intl'

export function StatusIndicator() {
  const [currentStatus, setCurrentStatus] = useState<StatusType>('vibecoding')
  const t = useTranslations('status')

  // Rotate status every 15 seconds (можно заменить на API или WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = statusMessages.map((s) => s.status)
      const currentIndex = statuses.indexOf(currentStatus)
      const nextIndex = (currentIndex + 1) % statuses.length
      setCurrentStatus(statuses[nextIndex] as StatusType)
    }, 15000)

    return () => clearInterval(interval)
  }, [currentStatus])

  const status = statusMessages.find((s) => s.status === currentStatus)!

  return (
    <motion.div
      className="fixed top-20 right-6 z-50 rounded-md border border-accent bg-accent/80 px-4 py-2 backdrop-blur-sm"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStatus}
          className="flex items-center gap-2 font-mono text-xs"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <span>{status.emoji}</span>
          <span className="text-foreground/70">Status:</span>
          <span className="text-foreground">{t(status.status)}</span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
