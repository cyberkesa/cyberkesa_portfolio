'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const easterEggMessages = [
  'System Overload. Too much style.',
  'Error: Aesthetic levels exceeded.',
  'Warning: Excessive perfectionism detected.',
  'Critical: Vibecoding in progress...',
  'Alert: Code quality too high.',
]

export function EasterEgg() {
  const [isTriggered, setIsTriggered] = useState(false)
  const [message, setMessage] = useState('')

  const handleTrigger = () => {
    const randomMessage =
      easterEggMessages[
        Math.floor(Math.random() * easterEggMessages.length)
      ]
    setMessage(randomMessage)
    setIsTriggered(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setIsTriggered(false)
    }, 3000)
  }

  return (
    <>
      {/* Hidden button */}
      <button
        onClick={handleTrigger}
        className="fixed bottom-4 left-4 z-50 rounded-md border border-accent/30 bg-accent/20 px-3 py-1.5 font-mono text-xs text-foreground/30 transition-all hover:border-accent/50 hover:text-foreground/50"
        aria-label="Do not press"
      >
        Do not press
      </button>

      {/* Overlay effect */}
      <AnimatePresence>
        {isTriggered && (
          <>
            <motion.div
              className="fixed inset-0 z-[10000] bg-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="fixed inset-0 z-[10001] flex items-center justify-center"
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

