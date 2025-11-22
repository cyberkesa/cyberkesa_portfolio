'use client'

import { useTheme } from 'next-themes'
import { useCallback } from 'react'

// Хук для управления RGB Signal Loss эффектом переключения темы
export function useChaosTheme() {
  const { theme, setTheme } = useTheme()

  // Логика RGB Shift (Signal Loss) - единственный эффект
  const triggerRGB = useCallback(
    (nextTheme: string) => {
      // Вешаем класс на html для запуска CSS анимации
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('rgb-transition')

        // Меняем тему в момент самого сильного искажения (200ms - середина анимации)
        setTimeout(() => {
          setTheme(nextTheme)
        }, 200)

        // Убираем класс после анимации (400ms)
        setTimeout(() => {
          document.documentElement.classList.remove('rgb-transition')
        }, 400)
      }
    },
    [setTheme]
  )

  // Главная функция переключения темы - всегда использует RGB эффект
  const triggerThemeSwitch = useCallback(
    () => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark'
      triggerRGB(nextTheme)
    },
    [theme, triggerRGB]
  )

  return {
    triggerThemeSwitch,
  }
}

