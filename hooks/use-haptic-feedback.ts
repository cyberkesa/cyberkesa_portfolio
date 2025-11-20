'use client'

/**
 * Hook for haptic feedback (vibration)
 * Provides tactile response on mobile devices
 */
export function useHapticFeedback() {
  const vibrate = (pattern: number | number[] = 10) => {
    if (typeof window === 'undefined' || !navigator.vibrate) return

    try {
      navigator.vibrate(pattern)
    } catch (error) {
      // Vibration not supported or blocked
    }
  }

  const lightTap = () => vibrate(10)
  const mediumTap = () => vibrate(20)
  const heavyTap = () => vibrate([10, 50, 10])

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
  }
}

