'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { logEntries } from '@/config/log'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export function LogSection() {
  const locale = useLocale()
  const t = useTranslations('log')

  return (
    <section className="min-h-screen py-24">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeInUp}
          className="mb-12 text-center font-mono text-4xl font-bold md:text-5xl"
        >
          {t('title')}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mb-16 text-center font-mono text-sm text-foreground/70"
        >
          {t('subtitle')}
        </motion.p>

        <div className="mx-auto max-w-6xl space-y-8">
          {logEntries.map((entry, index) => (
            <motion.article
              key={entry.id}
              variants={fadeInUp}
              className="group rounded-lg border border-accent bg-accent/20 p-6 backdrop-blur-sm transition-all hover:border-glow-soft hover:bg-accent/30"
            >
              <Link href={`/${locale}/log/${entry.id}`}>
                <div className="mb-2 flex items-center gap-4 font-mono text-xs text-foreground/50">
                  <span className="text-glow">[{entry.date}]</span>
                  <div className="flex gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-accent px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="mb-2 font-mono text-xl font-bold group-hover:text-glow transition-colors">
                  {entry.title}
                </h2>
                <p className="font-mono text-sm text-foreground/70">
                  {entry.excerpt}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          variants={fadeInUp}
          className="mt-16 text-center"
        >
          <Link
            href={`/${locale}`}
            className="font-mono text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            {t('backToHome')}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

