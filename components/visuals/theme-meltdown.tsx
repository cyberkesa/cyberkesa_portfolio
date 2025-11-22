'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { ThemeMeltdownProvider } from './theme-meltdown-context'

// Цвета для эффекта Pixel Sorting с усиленным глитч-эффектом
const COLORS = {
  dark: [
    '#050505', '#111111', '#1a1a1a', // Черные оттенки
    '#00ffff', '#00cccc', '#00ffaa', '#00ff88', // Яркие цианы и зелень
    '#ff00ff', '#ff00aa', '#ff0088', // Маджента (глитч)
    '#ffff00', '#ffaa00', // Желтый (артефакты)
    '#ff0000', '#aa0000', // Красный (ошибки)
  ],
  light: [
    '#fafafa', '#ffffff', '#eeeeee', '#dddddd', // Белые оттенки
    '#0000ff', '#000088', '#0066ff', '#0099ff', // Синие оттенки
    '#ff00ff', '#aa00aa', '#8800ff', // Маджента
    '#ff0000', '#aa0000', // Красный
    '#000000', '#333333', // Черный (контраст)
  ],
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

interface ThemeMeltdownProps {
  children?: React.ReactNode
  isActive?: boolean
  onComplete?: () => void
}

export function ThemeMeltdown({
  children,
  isActive: externalIsActive,
  onComplete,
}: ThemeMeltdownProps) {
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
    const stripWidth = 8 // Ширина каждой полоски в пикселях (уменьшена для большего глитча)
    const columns = Math.floor(canvas.width / stripWidth)
    const drops: number[] = [] // Позиция Y для каждой колонки
    const speeds: number[] = [] // Скорость падения для каждой колонки
    const heights: number[] = [] // Длина полоски
    const gaps: boolean[] = [] // Разрывы в полосках (глитч)
    const glitchOffset: number[] = [] // Смещение для эффекта дрожания

    // Инициализация: капли стартуют сверху с задержкой
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -500 - 200 // Случайный старт за экраном (ближе к экрану)
      speeds[i] = Math.random() * 30 + 20 // Случайная скорость (быстрая, ускорено)
      heights[i] = Math.random() * 80 + 5 // Больше вариации в длине (больше глитча)
      gaps[i] = Math.random() > 0.7 // 30% полосок имеют разрывы (глитч)
      glitchOffset[i] = (Math.random() - 0.5) * 4 // Случайное смещение для дрожания
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

      // Случайные вспышки глитча (мерцание экрана)
      if (Math.random() > 0.95) {
        ctx.fillStyle = currentPalette[Math.floor(Math.random() * currentPalette.length)]
        ctx.globalAlpha = 0.3
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 1.0
      }

      // Большие артефакты глитча (блоки разного размера)
      for (let a = 0; a < 15; a++) {
        if (Math.random() > 0.85) {
          ctx.fillStyle = currentPalette[Math.floor(Math.random() * currentPalette.length)]
          const artifactX = Math.random() * canvas.width
          const artifactY = Math.random() * canvas.height
          const artifactW = Math.random() * 40 + 10
          const artifactH = Math.random() * 60 + 20
          ctx.fillRect(artifactX, artifactY, artifactW, artifactH)
        }
      }

      // Случайные битые пиксели (глитч артефакты)
      for (let p = 0; p < 100; p++) {
        if (Math.random() > 0.8) {
          ctx.fillStyle = currentPalette[Math.floor(Math.random() * currentPalette.length)]
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 6 + 1,
            Math.random() * 6 + 1
          )
        }
      }

      // Рисуем вертикальные полоски с глитч-эффектами
      for (let i = 0; i < columns; i++) {
        // Выбираем случайный цвет из палитры для глитч-эффекта
        ctx.fillStyle = currentPalette[Math.floor(Math.random() * currentPalette.length)]

        // Случайное смещение для эффекта дрожания (обновляется каждый кадр)
        const offset = gaps[i] ? glitchOffset[i] * (Math.random() - 0.5) * 2 : glitchOffset[i]

        // Рисуем прямоугольник (пиксельный блок) с разрывами для глитча
        const x = i * stripWidth + offset
        const y = drops[i]
        let height = heights[i]

        // Разрывы в полосках (глитч эффект)
        if (gaps[i] && Math.random() > 0.5) {
          // Рисуем верхнюю часть полоски
          const topHeight = height * (0.3 + Math.random() * 0.2)
          if (y < canvas.height && y + topHeight > 0) {
            ctx.fillRect(x, y, stripWidth, topHeight)
          }

          // Разрыв
          const gapSize = Math.random() * 30 + 10

          // Рисуем нижнюю часть полоски после разрыва
          const bottomY = y + topHeight + gapSize
          const bottomHeight = height * (0.3 + Math.random() * 0.2)
          if (bottomY < canvas.height && bottomY + bottomHeight > 0) {
            ctx.fillRect(x, bottomY, stripWidth, bottomHeight)
          }
        } else {
          // Обычная полоска с вариацией длины
          height += Math.random() * 40 - 20 // Больше вариации для глитча

          // Рисуем только если полоска видна на экране
          if (y < canvas.height && y + height > 0) {
            ctx.fillRect(x, y, stripWidth, height)

            // Иногда добавляем горизонтальные артефакты (глитч)
            if (Math.random() > 0.9) {
              ctx.fillStyle = currentPalette[Math.floor(Math.random() * currentPalette.length)]
              const artifactY = y + Math.random() * height
              ctx.fillRect(x - 2, artifactY, stripWidth + 4, 2)
            }
          }
        }

        // Двигаем каплю вниз с вариацией скорости (глитч)
        const speedVariation = gaps[i] ? speeds[i] * (0.8 + Math.random() * 0.4) : speeds[i]
        drops[i] += speedVariation

        // Обновляем смещение для дрожания
        glitchOffset[i] += (Math.random() - 0.5) * 0.5
        if (Math.abs(glitchOffset[i]) > 4) {
          glitchOffset[i] *= -0.8
        }

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
        // Вызываем коллбэк завершения, если передан
        onComplete?.()
      }
    }

    // Запускаем анимацию
    draw()
  }, [isMelting, theme, setTheme, onComplete])

  // Запускаем эффект при изменении внешнего isActive
  useEffect(() => {
    if (externalIsActive && !isMelting) {
      triggerMeltdown()
    }
  }, [externalIsActive, isMelting, triggerMeltdown])

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
