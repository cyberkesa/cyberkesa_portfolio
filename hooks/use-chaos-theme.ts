'use client'

import { useTheme } from 'next-themes'
import { useCallback, useRef, useEffect } from 'react'

// Хук для управления RGB Signal Loss эффектом переключения темы
export function useChaosTheme() {
  const { theme, setTheme } = useTheme()
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current = []
    }
  }, [])

  // Логика RGB Shift (Signal Loss) - единственный эффект
  const triggerRGB = useCallback(
    (nextTheme: string) => {
      // Очищаем предыдущие таймеры, если они есть (защита от быстрых кликов)
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current = []

      // Вешаем класс на html для запуска CSS анимации
      if (typeof document !== 'undefined') {
        // Убираем предыдущий класс, если он есть
        document.documentElement.classList.remove('rgb-transition')
        // Небольшая задержка для сброса анимации
        requestAnimationFrame(() => {
          document.documentElement.classList.add('rgb-transition')
        })

        // Меняем тему в момент самого сильного искажения (250ms - 50% анимации, пик эффекта)
        const timeout1 = setTimeout(() => {
          setTheme(nextTheme)
          timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeout1)
        }, 250)
        timeoutsRef.current.push(timeout1)

        // Убираем класс после анимации (500ms)
        const timeout2 = setTimeout(() => {
          document.documentElement.classList.remove('rgb-transition')
          timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeout2)
        }, 500)
        timeoutsRef.current.push(timeout2)
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

