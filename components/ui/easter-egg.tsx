'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function EasterEgg() {
  const t = useTranslations('easterEgg.messages')
  const tButton = useTranslations('easterEgg')
  const [isTriggered, setIsTriggered] = useState(false)
  const [message, setMessage] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const easterEggMessages = [
    t('systemOverload'),
    t('aestheticExceeded'),
    t('perfectionismDetected'),
    t('vibecodingProgress'),
    t('codeQualityHigh'),
  ]

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleTrigger = () => {
    // Clear existing timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const randomMessage =
      easterEggMessages[
        Math.floor(Math.random() * easterEggMessages.length)
      ]
    setMessage(randomMessage)
    setIsTriggered(true)

    // Reset after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setIsTriggered(false)
      timeoutRef.current = null
    }, 3000)
  }

  return (
    <>
      {/* Hidden button */}
      <button
        onClick={handleTrigger}
        className="fixed bottom-4 left-4 z-50 rounded-md border border-accent/30 bg-accent/20 px-3 py-1.5 font-mono text-xs text-foreground/30 transition-all hover:border-accent/50 hover:text-foreground/50"
        aria-label={tButton('doNotPress')}
      >
        {tButton('doNotPress')}
      </button>

      {/* Overlay effect */}
      <AnimatePresence>
        {isTriggered && (
          <>
            <motion.div
              className="fixed inset-0 z-[99990] bg-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="fixed inset-0 z-[99991] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-lg border border-glow bg-accent/90 p-8 backdrop-blur-md">
                <p className="font-mono text-xl font-bold text-glow">
                  {message}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

