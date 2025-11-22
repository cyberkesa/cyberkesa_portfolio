'use client'

import { useTheme } from 'next-themes'
import { useCallback, useRef, useEffect, useState } from 'react'

// Хук для управления RGB Signal Loss эффектом переключения темы
export function useChaosTheme() {
  const { theme, setTheme } = useTheme()
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Проверка prefers-reduced-motion для accessibility
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }

    // Современные браузеры
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Fallback для старых браузеров
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

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

        // Меняем тему в момент самого сильного искажения (400ms - 50% анимации, пик эффекта)
        const timeout1 = setTimeout(() => {
          setTheme(nextTheme)
          timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeout1)
        }, 400)
        timeoutsRef.current.push(timeout1)

        // Убираем класс после анимации (800ms)
        const timeout2 = setTimeout(() => {
          document.documentElement.classList.remove('rgb-transition')
          timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeout2)
        }, 800)
        timeoutsRef.current.push(timeout2)
      }
    },
    [setTheme]
  )

  // Главная функция переключения темы
  const triggerThemeSwitch = useCallback(
    () => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark'

      // Если юзер отключил анимации в ОС — просто меняем тему без эффектов
      if (isReducedMotion) {
        setTheme(nextTheme)
        return
      }

      // Иначе запускаем RGB эффект
      triggerRGB(nextTheme)
    },
    [theme, triggerRGB, isReducedMotion, setTheme]
  )

  return {
    triggerThemeSwitch,
  }
}

