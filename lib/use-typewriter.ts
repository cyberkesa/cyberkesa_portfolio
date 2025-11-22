import { useEffect, useState, useRef } from 'react'

interface UseTypewriterOptions {
  speed?: number
  delay?: number
  onComplete?: () => void
}

/**
 * Hook for typewriter effect
 * Takes text and displays it character by character
 */
export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {}
) {
  const { speed = 50, delay = 0, onComplete } = options
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Reset state
    setDisplayText('')
    setIsTyping(true)

    // Initial delay
    const initialTimeout = setTimeout(() => {
      let currentIndex = 0

      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1))
          currentIndex++
          timeoutRef.current = setTimeout(typeNextChar, speed)
        } else {
          setIsTyping(false)
          if (onComplete) {
            onComplete()
          }
        }
      }

      typeNextChar()
    }, delay)

    return () => {
      clearTimeout(initialTimeout)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, speed, delay, onComplete])

  return { displayText, isTyping }
}

