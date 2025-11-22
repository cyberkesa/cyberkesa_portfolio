'use client'

import { createContext, useContext, type ReactNode } from 'react'

// Context для триггера эффекта Pixel Sorting при переключении темы
interface ThemeMeltdownContextType {
  triggerMeltdown: () => void
}

export const ThemeMeltdownContext = createContext<ThemeMeltdownContextType | null>(
  null
)

// Hook для использования контекста
export function useThemeMeltdown() {
  const context = useContext(ThemeMeltdownContext)
  if (!context) {
    throw new Error('useThemeMeltdown must be used within ThemeMeltdownProvider')
  }
  return context
}

// Provider компонент
export function ThemeMeltdownProvider({
  children,
  triggerMeltdown,
}: {
  children: ReactNode
  triggerMeltdown: () => void
}) {
  return (
    <ThemeMeltdownContext.Provider value={{ triggerMeltdown }}>
      {children}
    </ThemeMeltdownContext.Provider>
  )
}
