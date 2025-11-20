import { Variants } from 'framer-motion'

/**
 * Fade in and slide up animation variant
 * Used for text and content that appears on scroll
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

/**
 * Container variant for staggered children animations
 * Children appear sequentially with delay
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/**
 * Hover glow effect variant
 * Creates a subtle glow on hover for cards and buttons
 */
export const hoverGlow: Variants = {
  rest: {
    boxShadow: '0 0 0px rgba(0, 255, 255, 0)',
    scale: 1,
  },
  hover: {
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

/**
 * Fade in animation variant
 * Simple opacity transition
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

