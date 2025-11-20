'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { BudgetFilter } from './budget-filter'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { Mail, Send, X } from 'lucide-react'

export function ContactForm() {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    budget: 5000,
  })
  const [isLowBudget, setIsLowBudget] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const LOW_BUDGET_THRESHOLD = 1000

  const handleBudgetChange = (value: number) => {
    setFormData((prev) => ({ ...prev, budget: value }))
    setIsLowBudget(value < LOW_BUDGET_THRESHOLD)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // Handle network errors
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: '', email: '', message: '', budget: 5000 })
        setIsLowBudget(false)
      }, 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsSubmitting(false)
      // Handle network errors and other errors
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Network error. Please check your connection and try again.'
      alert(`Failed to send message: ${errorMessage}`)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className={cn(
              'relative rounded-lg border border-accent bg-accent/30 p-8 backdrop-blur-sm transition-all',
              isLowBudget && 'opacity-50 grayscale'
            )}
          >
            {/* Name */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="mb-2 block font-mono text-sm font-medium text-foreground/80"
              >
                {t('name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-accent bg-accent/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:border-glow-soft focus:outline-none focus:ring-2 focus:ring-glow-soft"
                placeholder={t('namePlaceholder')}
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="mb-2 block font-mono text-sm font-medium text-foreground/80"
              >
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-accent bg-accent/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:border-glow-soft focus:outline-none focus:ring-2 focus:ring-glow-soft"
                placeholder={t('emailPlaceholder')}
              />
            </div>

            {/* Budget Filter */}
            <div className="mb-6">
              <BudgetFilter
                value={formData.budget}
                onChange={handleBudgetChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label
                htmlFor="message"
                className="mb-2 block font-mono text-sm font-medium text-foreground/80"
              >
                {t('message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-md border border-accent bg-accent/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:border-glow-soft focus:outline-none focus:ring-2 focus:ring-glow-soft resize-none"
                placeholder={t('messagePlaceholder')}
              />
            </div>

            {/* Submit Button */}
            <motion.div
              className="flex justify-end"
              animate={{
                x: isLowBudget ? [0, -10, 10, -10, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                repeat: isLowBudget ? Infinity : 0,
                repeatDelay: 2,
              }}
            >
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || isLowBudget}
                className={cn(
                  'inline-flex items-center gap-2',
                  isLowBudget && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="h-4 w-4 border-2 border-foreground border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t('submit')}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="rounded-lg border border-glow bg-accent/30 p-12 text-center backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-glow bg-glow/10"
            >
              <Mail className="h-8 w-8 text-glow" />
            </motion.div>
            <h3 className="mb-2 font-mono text-xl font-bold text-glow">
              {t('successTitle')}
            </h3>
            <p className="font-mono text-sm text-foreground/70">
              {t('successMessage')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

