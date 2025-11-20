'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Terminal } from '@/components/ui/terminal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  const t = useTranslations('notFound')
  const locale = useLocale()

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="container mx-auto max-w-2xl">
        <Terminal title="error">
          <div className="space-y-4">
            <div className="text-red-500 dark:text-red-400">
              <span className="font-bold">{t('error')}</span> {t('message')}
            </div>
            <div className="text-foreground/70">
              <p>{t('description')}</p>
            </div>
            <div className="mt-8">
              <div className="mb-2 text-foreground/50">
                $ <span className="text-foreground">ls -la /</span>
              </div>
              <div className="ml-4 space-y-1 font-mono text-sm text-foreground/60">
                <div>drwxr-xr-x home</div>
                <div>drwxr-xr-x projects</div>
                <div>drwxr-xr-x contact</div>
              </div>
            </div>
            <div className="mt-8">
              <Link href={`/${locale}`}>
                <Button>{t('returnHome')}</Button>
              </Link>
            </div>
          </div>
        </Terminal>
      </div>
    </div>
  )
}

