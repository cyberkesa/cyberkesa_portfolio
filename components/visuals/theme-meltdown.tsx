'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { ThemeMeltdownProvider } from './theme-meltdown-context'

// Цвета для эффекта Pixel Sorting (подобраны под дизайн проекта)
const COLORS = {
  dark: ['#050505', '#111111', '#1a1a1a', '#00ffff', '#00cccc'], // Черный + Циан (glow)
  light: ['#fafafa', '#ffffff', '#eeeeee', '#0000ff', '#000088'], // Белый + Синий (glow)
}

// Функция генерации звука "Data Crash" через Web Audio API
// Создает резкий цифровой скрежет, переходящий в низкий гул
async function playDataCrashSound() {
  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()

    // Возобновляем контекст, если он в suspended состоянии
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    const oscillator1 = audioContext.createOscillator()
    const oscillator2 = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()

    // Первый осциллятор: резкий скрежет (высокая частота)
    oscillator1.type = 'sawtooth'
    oscillator1.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(
      100,
      audioContext.currentTime + 0.3
    )

    // Второй осциллятор: низкий гул (бас)
    oscillator2.type = 'square'
    oscillator2.frequency.setValueAtTime(60, audioContext.currentTime)
    oscillator2.frequency.exponentialRampToValueAtTime(
      40,
      audioContext.currentTime + 0.5
    )

    // Фильтр для искажения (глитч эффект)
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1000, audioContext.currentTime)
    filter.Q.setValueAtTime(30, audioContext.currentTime)

    // Огибающая громкости (fade out)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.6
    )

    // Соединение узлов
    oscillator1.connect(filter)
    oscillator2.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Запуск и остановка
    oscillator1.start(audioContext.currentTime)
    oscillator2.start(audioContext.currentTime)
    oscillator1.stop(audioContext.currentTime + 0.6)
    oscillator2.stop(audioContext.currentTime + 0.6)

    // Очистка контекста после завершения
    setTimeout(() => {
      if (audioContext.state !== 'closed') {
        audioContext.close()
      }
    }, 700)
  } catch (error) {
    // Fallback: если Web Audio API не доступен, просто игнорируем ошибку
    console.warn('Audio context not available:', error)
  }
}

export function ThemeMeltdown({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMelting, setIsMelting] = useState(false)
  const animationFrameRef = useRef<number | null>(null)

  // Функция запуска эффекта "Таяния"
  const triggerMeltdown = useCallback(() => {
    if (isMelting) return
    setIsMelting(true)

    // Проигрываем звук Data Crash
    playDataCrashSound()

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Настройка размеров Canvas
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Конфиг частиц (вертикальные полоски)
    const stripWidth = 10 // Ширина каждой полоски в пикселях
    const columns = Math.floor(canvas.width / stripWidth)
    const drops: number[] = [] // Позиция Y для каждой колонки
    const speeds: number[] = [] // Скорость падения для каждой колонки
    const heights: number[] = [] // Длина полоски

    // Инициализация: капли стартуют сверху с задержкой
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -500 - 200 // Случайный старт за экраном (ближе к экрану)
      speeds[i] = Math.random() * 30 + 20 // Случайная скорость (быстрая, ускорено)
      heights[i] = Math.random() * 50 + 10 // Случайная длина полоски
    }

    // Определяем палитру цветов (текущая тема)
    let currentPalette = theme === 'dark' ? COLORS.dark : COLORS.light
    let bgColor = theme === 'dark' ? 'rgba(5, 5, 5, 0.25)' : 'rgba(250, 250, 250, 0.25)' // Увеличена прозрачность для быстрого "очищения"

    let phase: 'melt' | 'swap' | 'clear' = 'melt'
    let themeSwapped = false

    const draw = () => {
      // Эффект шлейфа: затемняем предыдущие кадры для эффекта "смазывания"
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Рисуем вертикальные полоски
      for (let i = 0; i < columns; i++) {
        // Выбираем случайный цвет из палитры для глитч-эффекта
        ctx.fillStyle = currentPalette[Math.floor(Math.random() * currentPalette.length)]

        // Рисуем прямоугольник (пиксельный блок)
        const x = i * stripWidth
        const y = drops[i]
        const height = heights[i] + Math.random() * 20 // Небольшая вариация длины

        // Рисуем только если полоска видна на экране
        if (y < canvas.height && y + height > 0) {
          ctx.fillRect(x, y, stripWidth, height)
        }

        // Двигаем каплю вниз
        drops[i] += speeds[i]

        // Логика фаз
        // Phase 1 -> Phase 2: Когда большинство капель достигло 1/3 экрана (ускорено)
        if (
          phase === 'melt' &&
          !themeSwapped &&
          drops[Math.floor(columns / 2)] > canvas.height / 3
        ) {
          // Phase 2: Меняем тему (под прикрытием эффекта)
          const nextTheme = theme === 'dark' ? 'light' : 'dark'
          setTheme(nextTheme)
          // Переключаем палитру на новую тему
          currentPalette = nextTheme === 'dark' ? COLORS.dark : COLORS.light
          bgColor = nextTheme === 'dark' ? 'rgba(5, 5, 5, 0.25)' : 'rgba(250, 250, 250, 0.25)'
          themeSwapped = true
          phase = 'clear'
        }
      }

      // Проверка: если все капли улетели вниз, останавливаем анимацию (ускорено)
      const allFinished = drops.every((y) => y > canvas.height + 50)

      if (!allFinished) {
        animationFrameRef.current = requestAnimationFrame(draw)
      } else {
        // Очистка Canvas и завершение эффекта
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setIsMelting(false)
        phase = 'melt'
        themeSwapped = false
      }
    }

    // Запускаем анимацию
    draw()
  }, [isMelting, theme, setTheme])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Обработка изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && !isMelting) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMelting])

  return (
    <ThemeMeltdownProvider triggerMeltdown={triggerMeltdown}>
      {/* Canvas поверх всего (Z-Index: 9999) */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
          isMelting ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Дочерние компоненты */}
      {children}
    </ThemeMeltdownProvider>
  )
}
