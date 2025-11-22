'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'
import { cn } from '@/lib/utils'

export interface BudgetFilterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

/**
 * BudgetFilter - Interactive budget slider with "Agency Killer" attitude
 * Reacts to low/high budgets with visual feedback and haptics
 */
export function BudgetFilter({
  value,
  onChange,
  min = 0,
  max = 50000,
  disabled = false,
}: BudgetFilterProps) {
  const t = useTranslations('contact')
  const [isLowBudget, setIsLowBudget] = useState(false)
  const [isHighBudget, setIsHighBudget] = useState(false)
  const { vibrate, lightTap, mediumTap } = useHapticFeedback()

  // Thresholds
  const LOW_THRESHOLD = 1000
  const HIGH_THRESHOLD = 10000

  // Update states based on value
  useEffect(() => {
    setIsLowBudget(value < LOW_THRESHOLD)
    setIsHighBudget(value >= HIGH_THRESHOLD)
  }, [value])

  // Haptic feedback on high budget (only trigger once when crossing threshold)
  useEffect(() => {
    if (isHighBudget && value >= HIGH_THRESHOLD) {
      mediumTap()
    }
  }, [isHighBudget, value, mediumTap])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    onChange(newValue)

    // Haptic feedback
    if (newValue >= HIGH_THRESHOLD && !isHighBudget) {
      mediumTap()
    } else if (newValue < LOW_THRESHOLD && !isLowBudget) {
      lightTap()
    }
  }

  // Format value for display (translated)
  const formatValue = (val: number) => {
    if (val >= 1000) {
      const value = (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)
      return t('budgetFormatK', { value: parseFloat(value) })
    }
    return t('budgetFormatValue', { value: val })
  }

  // Calculate percentage for gradient
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="relative w-full">
      {/* Label */}
      <div className="mb-4 flex items-center justify-between">
        <label className="font-mono text-sm font-medium text-foreground/80">
          {t('budgetLabel')}
        </label>
        <span
          className={cn(
            'font-mono text-lg font-bold transition-colors',
            isLowBudget && 'text-foreground/30',
            isHighBudget && 'text-glow',
            !isLowBudget && !isHighBudget && 'text-foreground/70'
          )}
        >
          {formatValue(value)}
        </span>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Background Track */}
        <div className="h-2 w-full rounded-full bg-accent/20" />

        {/* Animated Track (glow effect for high budget) */}
        <motion.div
          className={cn(
            'absolute top-0 h-2 rounded-full transition-all',
            isHighBudget
              ? 'bg-gradient-to-r from-glow via-glow-soft to-glow'
              : 'bg-accent/40'
          )}
          style={{
            width: `${percentage}%`,
          }}
          animate={{
            boxShadow: isHighBudget
              ? [
                  '0 0 10px rgba(0, 255, 255, 0.3)',
                  '0 0 20px rgba(0, 255, 255, 0.5)',
                  '0 0 10px rgba(0, 255, 255, 0.3)',
                ]
              : 'none',
          }}
          transition={{
            duration: 2,
            repeat: isHighBudget ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'absolute top-0 h-2 w-full cursor-pointer appearance-none bg-transparent',
            'slider-thumb',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          style={{
            background: 'transparent',
          }}
        />

        {/* Custom Thumb */}
        <motion.div
          className={cn(
            'absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 transition-all',
            'pointer-events-none',
            isHighBudget
              ? 'border-glow bg-glow'
              : 'border-foreground/60 bg-foreground/20', // Более видимый в темной теме
            isLowBudget && 'border-foreground/30 bg-foreground/10'
          )}
          style={{
            left: `${percentage}%`,
          }}
          animate={{
            scale: isHighBudget ? [1, 1.2, 1] : 1,
            boxShadow: isHighBudget
              ? [
                  '0 0 15px rgba(0, 255, 255, 0.6)',
                  '0 0 25px rgba(0, 255, 255, 0.8)',
                  '0 0 15px rgba(0, 255, 255, 0.6)',
                ]
              : '0 2px 8px rgba(0, 0, 0, 0.3)', // Более заметная тень
          }}
          transition={{
            duration: 0.5,
            repeat: isHighBudget ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="mt-2 flex justify-between font-mono text-xs text-foreground/40">
        <span>{t('budgetFormatValue', { value: min })}</span>
        <span>{t('budgetFormatKPlus', { value: max / 1000 })}</span>
      </div>

      {/* Status Messages */}
      <motion.div
        className="mt-4 min-h-[24px]"
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isLowBudget || isHighBudget ? 1 : 0,
          y: isLowBudget || isHighBudget ? 0 : -10,
        }}
        transition={{ duration: 0.3 }}
      >
        {isLowBudget && (
          <p className="font-mono text-xs text-foreground/30">
            {t('budgetLowMessage')}
          </p>
        )}
        {isHighBudget && (
          <motion.p
            className="font-mono text-sm font-medium text-glow"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {t('budgetHighMessage')}
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

