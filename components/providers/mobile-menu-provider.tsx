'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useMotionValue, useTransform } from 'framer-motion'

interface MobileMenuContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  contentScale: any
  contentBlur: any
}

const MobileMenuContext = createContext<MobileMenuContextType | null>(null)

export function useMobileMenu() {
  const context = useContext(MobileMenuContext)
  if (!context) {
    throw new Error('useMobileMenu must be used within MobileMenuProvider')
  }
  return context
}

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const y = useMotionValue(0)
  const contentScale = useTransform(y, [-300, 0], [0.85, 1])
  const contentBlur = useTransform(y, [-300, 0], [15, 0])
  
  // Update y when menu opens/closes
  useEffect(() => {
    if (isOpen) {
      y.set(-300)
    } else {
      y.set(0)
    }
  }, [isOpen, y])
  
  return (
    <MobileMenuContext.Provider value={{ isOpen, setIsOpen, contentScale, contentBlur }}>
      <div
        style={{
          scale: contentScale,
          filter: `blur(${contentBlur}px)`,
          transition: 'filter 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </MobileMenuContext.Provider>
  )
}

