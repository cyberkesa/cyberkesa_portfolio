import { Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/config'
import { metadata } from '../metadata'
import '../global.css'
import { LenisProvider } from '@/components/providers/lenis-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
// import FluidBackground from '@/components/visuals/fluid-background' // Temporarily disabled

export { metadata }

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: true,
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Load messages for the locale
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <body className={geistMono.variable}>
        {/* Background Layer (Z-0): R3F Canvas with shaders */}
        {/* Temporarily disabled - uncomment when R3F is working */}
        {/* <FluidBackground /> */}

        {/* Content Layer (Z-20): HTML/DOM elements */}
        <div className="relative z-20">
          <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
              <LenisProvider>{children}</LenisProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}

