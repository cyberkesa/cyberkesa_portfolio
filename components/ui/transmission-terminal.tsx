'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Send, X } from 'lucide-react'

interface TransmissionTerminalProps {
  onSubmit: (data: {
    name: string
    email: string
    message: string
    budget: number
  }) => Promise<void>
}

// Budget modes will be translated dynamically

const HOLD_DURATION = 1500 // 1.5 seconds

export function TransmissionTerminal({ onSubmit }: TransmissionTerminalProps) {
  const t = useTranslations('contact')
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    budget: 5000,
  })
  const [isHolding, setIsHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logEntries, setLogEntries] = useState<string[]>([])
  const [isTextareaFocused, setIsTextareaFocused] = useState(false)
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const logIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Get current budget mode (translated)
  const getBudgetMode = () => {
    if (formData.budget >= 0 && formData.budget < 5000) {
      return { mode: t('budgetModeMvp'), color: 'text-foreground/30' }
    } else if (formData.budget >= 5000 && formData.budget < 15000) {
      return { mode: t('budgetModeProduction'), color: 'text-cyan-400' }
    } else if (formData.budget >= 15000 && formData.budget < 50000) {
      return { mode: t('budgetModeHeavyLuxury'), color: 'text-purple-400' }
    } else {
      return { mode: t('budgetModeWorldDomination'), color: 'text-orange-500' }
    }
  }
  const currentMode = getBudgetMode()

  // Generate log entries (translated)
  useEffect(() => {
    const logs = [
      t('logEncryption'),
      t('logNode'),
      t('logUptime'),
      t('logStatusWaiting'),
      formData.name ? t('logOperatorIdentified', { name: formData.name }) : null,
      formData.budget >= 50000 ? t('logWorldDominationActivated') : null,
      formData.message ? t('logMissionObjectiveReceived') : null,
    ].filter(Boolean) as string[]

    setLogEntries(logs)

    // Auto-update logs
    if (logIntervalRef.current) {
      clearInterval(logIntervalRef.current)
    }
    logIntervalRef.current = setInterval(() => {
      setLogEntries((prev) => {
        const newLogs = [...prev]
        // Check if operator identified log exists by checking if name is in logs
        if (formData.name && !newLogs.some((l) => l.includes(formData.name))) {
          newLogs.push(t('logOperatorIdentified', { name: formData.name }))
        }
        return newLogs.slice(-6) // Keep last 6 logs
      })
    }, 3000)

    return () => {
      if (logIntervalRef.current) {
        clearInterval(logIntervalRef.current)
      }
    }
  }, [formData.name, formData.budget, formData.message, t])

  // Handle hold to send
  const handleMouseDown = () => {
    if (isSubmitting || !formData.name || !formData.email || !formData.message) return

    setIsHolding(true)
    setHoldProgress(0)

    // Progress animation
    const startTime = Date.now()
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100)
      setHoldProgress(progress)

      if (progress >= 100) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
        }
        handleSubmit()
      }
    }, 16) // ~60fps
  }

  const handleMouseUp = () => {
    setIsHolding(false)
    setHoldProgress(0)
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current)
    }
  }

  const handleSubmit = async () => {
    setIsHolding(false)
    setIsSubmitting(true)
    setError(null)

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    try {
      await onSubmit(formData)
      setIsSubmitted(true)
      
      // Очищаем предыдущий таймер, если он есть
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current)
      }
      
      submitTimeoutRef.current = setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: '', email: '', message: '', budget: 5000 })
        submitTimeoutRef.current = null
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('transmissionFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cleanup
  useEffect(() => {
    // Копируем значения refs в переменные для cleanup функции (исправляет предупреждение линтера)
    const holdTimeout = holdTimeoutRef.current
    const progressInterval = progressIntervalRef.current
    const logInterval = logIntervalRef.current
    const submitTimeout = submitTimeoutRef.current
    
    return () => {
      if (holdTimeout) clearTimeout(holdTimeout)
      if (progressInterval) clearInterval(progressInterval)
      if (logInterval) clearInterval(logInterval)
      if (submitTimeout) clearTimeout(submitTimeout)
    }
  }, [])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, message: e.target.value }))
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setFormData((prev) => ({ ...prev, budget: value }))
  }

  const budgetPercentage = ((formData.budget - 0) / (100000 - 0)) * 100

  return (
    <section
      id="contact"
      className="border-t border-foreground/10 bg-accent/30 font-mono text-sm"
    >
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT: STATUS LOG */}
          <div className="flex flex-col justify-between space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 uppercase tracking-wider">
                {t('terminalTitle')}
              </h2>
              <p className="text-foreground/50 text-xs uppercase tracking-widest">
                {t('terminalStatus')}
              </p>
            </div>

            {/* Decorative Logs */}
            <div className="text-xs text-foreground/30 font-mono space-y-1 select-none">
              {logEntries.map((log, i) => (
                <motion.p
                  key={`${log}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {log}
                </motion.p>
              ))}
            </div>

            {/* Contact Links */}
            <div className="flex flex-col gap-4">
              <a
                href="https://t.me/st3qt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-cyan-400 transition-colors text-xs uppercase tracking-widest"
              >
                {t('directLine')}
              </a>
              <a
                href="mailto:contact@cyberkesa.com"
                className="text-foreground/60 hover:text-cyan-400 transition-colors text-xs uppercase tracking-widest"
              >
                {t('commsLinkText')}
              </a>
            </div>
          </div>

          {/* RIGHT: THE FORM */}
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                {/* OPERATOR_ID */}
                <div className="group relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    placeholder=" "
                    className="block w-full bg-transparent border-b border-foreground/20 py-4 text-foreground focus:border-cyan-400 focus:outline-none transition-colors peer"
                  />
                  <label className="absolute left-0 top-4 text-foreground/50 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs uppercase tracking-widest">
                    {t('operatorId')}
                  </label>
                </div>

                {/* COMMS_LINK */}
                <div className="group relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                    placeholder=" "
                    className="block w-full bg-transparent border-b border-foreground/20 py-4 text-foreground focus:border-cyan-400 focus:outline-none transition-colors peer"
                  />
                  <label className="absolute left-0 top-4 text-foreground/50 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs uppercase tracking-widest">
                    {t('commsLink')}
                  </label>
                </div>

                {/* RESOURCE ALLOCATION (Budget Slider) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-foreground/50 uppercase tracking-widest">
                      {t('resourceAllocation')}
                    </span>
                    <span className={cn('font-bold uppercase tracking-widest', currentMode.color)}>
                      {t('budgetModeLabel')} {currentMode.mode}
                    </span>
                  </div>

                  {/* Scale marks */}
                  <div className="relative h-8">
                    <div className="absolute inset-0 flex justify-between">
                      {[0, 5, 15, 50, 100].map((mark) => (
                        <div
                          key={mark}
                          className="flex flex-col items-center"
                          style={{ left: `${(mark / 100) * 100}%` }}
                        >
                          <div className="h-2 w-px bg-foreground/20" />
                          <span className="mt-1 text-[8px] text-foreground/30">
                            {mark === 100 
                              ? t('budgetFormatKPlus', { value: mark })
                              : t('budgetFormatK', { value: mark })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slider */}
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    value={formData.budget}
                    onChange={handleBudgetChange}
                    className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 slider-thumb"
                    style={{
                      background: `linear-gradient(to right, transparent 0%, transparent ${budgetPercentage}%, rgba(255,255,255,0.1) ${budgetPercentage}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />

                  <div className="flex justify-between text-[10px] text-foreground/30">
                    <span>{t('budgetMinLabel')}</span>
                    <span>{t('budgetMaxLabel')}</span>
                  </div>
                </div>

                {/* MISSION_OBJECTIVE (Terminal-style textarea) */}
                <div className="group relative">
                  <div className="relative">
                    {/* Line numbers background */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 text-foreground/20 text-[10px] font-mono select-none pointer-events-none">
                      {Array.from({ length: Math.max(4, formData.message.split('\n').length) }).map(
                        (_, i) => (
                          <div key={i} className="h-6 leading-6">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                        )
                      )}
                    </div>

                    <textarea
                      ref={textareaRef}
                      value={formData.message}
                      onChange={handleMessageChange}
                      onFocus={() => setIsTextareaFocused(true)}
                      onBlur={() => setIsTextareaFocused(false)}
                      required
                      rows={4}
                      placeholder=" "
                      className="block w-full bg-transparent border-b border-foreground/20 py-4 pl-14 text-foreground focus:border-cyan-400 focus:outline-none transition-colors peer resize-none font-mono text-xs leading-6"
                      style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
                    />

                    {/* Blinking cursor */}
                    {isTextareaFocused && (
                      <motion.span
                        className="absolute text-cyan-400 pointer-events-none"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                        style={{
                          left: 'calc(3rem + 1ch)',
                          top: '1rem',
                        }}
                      >
                        |
                      </motion.span>
                    )}
                  </div>

                  <label className="absolute left-0 -top-4 text-foreground/50 text-xs uppercase tracking-widest peer-[:not(:placeholder-shown)]:opacity-0 transition-opacity">
                    {t('missionObjective')}
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 font-mono text-xs text-red-500"
                  >
                    <X className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* TRANSMIT BUTTON (Hold to Send) */}
                <motion.button
                  type="button"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchEnd={handleMouseUp}
                  disabled={
                    isSubmitting ||
                    !formData.name ||
                    !formData.email ||
                    !formData.message
                  }
                  className={cn(
                    'relative w-full h-12 px-8 border-2 border-foreground/20 text-foreground hover:border-cyan-400 hover:text-cyan-400 transition-all uppercase tracking-widest font-bold overflow-hidden',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    isHolding && 'border-cyan-400 text-cyan-400',
                    'flex items-center justify-center'
                  )}
                  animate={
                    formData.budget >= 50000 && isHolding
                      ? {
                          x: [0, -2, 2, -2, 2, 0],
                          rotate: [0, -1, 1, -1, 1, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 0.1, repeat: Infinity }}
                >
                  {/* Progress fill */}
                  {isHolding && (
                    <motion.div
                      className="absolute inset-0 bg-cyan-400/20"
                      initial={{ width: 0 }}
                      animate={{ width: `${holdProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  )}

                  {/* Button text */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        {t('transmitting')}
                      </>
                    ) : isHolding ? (
                      <>
                        <span>{Math.round(holdProgress)}%</span>
                        <span>{t('holdToSend')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t('transmitData')}
                      </>
                    )}
                  </span>

                  {/* Circular progress indicator */}
                  {isHolding && (
                    <motion.svg
                      className="absolute top-2 right-2 w-8 h-8"
                      viewBox="0 0 32 32"
                    >
                      <motion.circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        strokeDashoffset={`${2 * Math.PI * 14 * (1 - holdProgress / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 16 16)"
                        className="text-cyan-400"
                      />
                    </motion.svg>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-400 bg-cyan-400/10"
                >
                  <Send className="h-8 w-8 text-cyan-400" />
                </motion.div>
                <h3 className="font-mono text-xl font-bold text-cyan-400 uppercase tracking-widest">
                  {t('transmissionSuccess')}
                </h3>
                <p className="font-mono text-sm text-foreground/70">
                  {t('transmissionMessage')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

