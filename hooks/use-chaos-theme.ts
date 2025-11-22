'use client'

import { useTheme } from 'next-themes'
import { useState, useCallback } from 'react'

// Типы доступных эффектов перехода
type TransitionType = 'eclipse' | 'melt' | 'rgb'

  // Хук для управления случайными эффектами переключения темы (Chaos Engine)
  export function useChaosTheme() {
    const { theme, setTheme } = useTheme()
    const [isMelting, setIsMelting] = useState(false)

    // 1. Логика RGB Shift (Signal Loss)
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

  // 2. Логика Melt (Pixel Sorting)
  const triggerMelt = useCallback(
    (nextTheme: string) => {
      // Активируем состояние, которое запустит Canvas анимацию
      setIsMelting(true)
      // Тема будет изменена внутри компонента ThemeMeltdown
    },
    []
  )

  // 3. Логика Eclipse (View Transition API)
  const triggerEclipse = useCallback(
    (e: React.MouseEvent | undefined, nextTheme: string) => {
      // Проверяем поддержку View Transition API
      if (typeof document === 'undefined' || !('startViewTransition' in document)) {
        // Fallback: просто меняем тему
        setTheme(nextTheme)
        return
      }

      // Получаем координаты клика или центр экрана
      const x = e?.clientX ?? window.innerWidth / 2
      const y = e?.clientY ?? window.innerHeight / 2
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      // Запускаем View Transition
      const transition = (document as any).startViewTransition(() => {
        setTheme(nextTheme)
      })

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
          },
          {
            duration: 750,
            easing: 'cubic-bezier(0.64, 0, 0.78, 0)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      })
    },
    [setTheme]
  )

  // Главная функция переключения темы с случайным выбором эффекта
  const triggerThemeSwitch = useCallback(
    (e?: React.MouseEvent) => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark'

      // Выбираем случайный эффект из доступных
      const effects: TransitionType[] = ['eclipse', 'melt', 'rgb']
      const randomEffect = effects[Math.floor(Math.random() * effects.length)]

      console.log(`[SYSTEM] Executing transition protocol: ${randomEffect.toUpperCase()}`)

      switch (randomEffect) {
        case 'rgb':
          triggerRGB(nextTheme)
          break
        case 'melt':
          triggerMelt(nextTheme)
          break
        case 'eclipse':
        default:
          triggerEclipse(e, nextTheme)
          break
      }
    },
    [theme, triggerRGB, triggerMelt, triggerEclipse]
  )

  return {
    triggerThemeSwitch,
    isMelting,
    setIsMelting,
  }
}

