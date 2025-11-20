import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Supported locales
export const locales = [
  'en', // English
  'ru', // Russian
  'zh', // Chinese Simplified
  'es', // Spanish
  'ar', // Arabic (RTL)
  'ja', // Japanese
  'de', // German
  'fr', // French
  'pt', // Portuguese
  'ko', // Korean
  'it', // Italian
  'he', // Hebrew (RTL)
] as const

export type Locale = (typeof locales)[number]

// RTL languages
export const rtlLocales: Locale[] = ['ar', 'he']

// Locale groups for UI
export const localeGroups = {
  amer: ['en', 'es', 'pt'],
  emea: ['de', 'fr', 'it', 'ru'],
  apac: ['zh', 'ja', 'ko'],
  mena: ['ar', 'he'],
} as const

// Locale metadata
export const localeMetadata: Record<
  Locale,
  { name: string; nativeName: string; flag: string }
> = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  he: { name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en' // Fallback to default
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

