'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, X } from 'lucide-react'
import { locales, localeGroups, localeMetadata, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'
import { fadeIn } from '@/lib/animations'

export function LanguageSwitcher() {
  const t = useTranslations('language')
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredLocale, setHoveredLocale] = useState<Locale | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale() as Locale
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const switchLocale = (locale: Locale) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`)
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-accent bg-accent/80 backdrop-blur-sm transition-all hover:border-glow-soft hover:bg-accent"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t('changeLanguage')}
      >
        <Globe className="h-5 w-5" />
      </motion.button>

      {/* Command Palette Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[99980] bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Palette */}
            <motion.div
              ref={containerRef}
              className="fixed left-1/2 top-1/2 z-[99981] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-accent bg-accent/90 p-6 backdrop-blur-md"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-mono text-xl font-bold">{t('selectRegion')}</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1 transition-colors hover:bg-accent-hover"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Language Grid */}
              <div className="space-y-6">
                {/* AMER */}
                <div>
                  <div className="mb-3 font-mono text-sm text-foreground/60">
                    &gt; {t('amer')}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {localeGroups.amer.map((locale) => (
                      <LocaleButton
                        key={locale}
                        locale={locale}
                        isActive={locale === currentLocale}
                        isHovered={hoveredLocale === locale}
                        onHover={() => setHoveredLocale(locale)}
                        onSelect={() => switchLocale(locale)}
                      />
                    ))}
                  </div>
                </div>

                {/* EMEA */}
                <div>
                  <div className="mb-3 font-mono text-sm text-foreground/60">
                    &gt; {t('emea')}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {localeGroups.emea.map((locale) => (
                      <LocaleButton
                        key={locale}
                        locale={locale}
                        isActive={locale === currentLocale}
                        isHovered={hoveredLocale === locale}
                        onHover={() => setHoveredLocale(locale)}
                        onSelect={() => switchLocale(locale)}
                      />
                    ))}
                  </div>
                </div>

                {/* APAC */}
                <div>
                  <div className="mb-3 font-mono text-sm text-foreground/60">
                    &gt; {t('apac')}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {localeGroups.apac.map((locale) => (
                      <LocaleButton
                        key={locale}
                        locale={locale}
                        isActive={locale === currentLocale}
                        isHovered={hoveredLocale === locale}
                        onHover={() => setHoveredLocale(locale)}
                        onSelect={() => switchLocale(locale)}
                      />
                    ))}
                  </div>
                </div>

                {/* MENA */}
                <div>
                  <div className="mb-3 font-mono text-sm text-foreground/60">
                    &gt; {t('mena')}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {localeGroups.mena.map((locale) => (
                      <LocaleButton
                        key={locale}
                        locale={locale}
                        isActive={locale === currentLocale}
                        isHovered={hoveredLocale === locale}
                        onHover={() => setHoveredLocale(locale)}
                        onSelect={() => switchLocale(locale)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer hint */}
              <div className="mt-6 border-t border-accent pt-4 text-center font-mono text-xs text-foreground/50">
                {t('pressHint')} <kbd className="rounded bg-accent px-1.5 py-0.5">Ctrl+K</kbd> {t('or')}{' '}
                <kbd className="rounded bg-accent px-1.5 py-0.5">Esc</kbd> {t('toClose')}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface LocaleButtonProps {
  locale: Locale
  isActive: boolean
  isHovered: boolean
  onHover: () => void
  onSelect: () => void
}

function LocaleButton({
  locale,
  isActive,
  isHovered,
  onHover,
  onSelect,
}: LocaleButtonProps) {
  const meta = localeMetadata[locale]

  return (
    <motion.button
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        'group relative rounded-md border px-4 py-2 font-mono text-sm transition-all',
        isActive
          ? 'border-glow bg-glow-soft text-foreground'
          : 'border-accent bg-accent/50 text-foreground/70 hover:border-glow-soft hover:bg-accent',
        isHovered && 'scale-105'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="mr-2">{meta.flag}</span>
      <span className="font-bold">[{locale.toUpperCase()}]</span>
      <span className="ml-2 text-xs opacity-70">{meta.nativeName}</span>
    </motion.button>
  )
}

