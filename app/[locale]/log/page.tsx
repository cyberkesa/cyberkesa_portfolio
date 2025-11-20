import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LogSection } from '@/components/sections/log-section'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { StatusIndicator } from '@/components/ui/status-indicator'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { ProgressPill } from '@/components/ui/progress-pill'

export default function LogPage() {
  return (
    <>
      <Header />
      <StatusIndicator />
      <CustomCursor />
      <ProgressPill />
      <main>
        <LogSection />
      </main>
      <Footer />
      <LanguageSwitcher />
    </>
  )
}

