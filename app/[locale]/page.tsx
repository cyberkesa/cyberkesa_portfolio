import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { StackSection } from '@/components/sections/stack-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { ServicesSection } from '@/components/sections/services-section'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { StatusIndicator } from '@/components/ui/status-indicator'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { EasterEgg } from '@/components/ui/easter-egg'
import { MobileMenu } from '@/components/ui/mobile-menu'

export default function Home() {
  return (
    <>
      <Header />
      <StatusIndicator />
      <CustomCursor />
      <EasterEgg />
      <MobileMenu />
      <main>
        <HeroSection />
        <AboutSection />
        <StackSection />
        <ProjectsSection />
        <ServicesSection />
      </main>
      <Footer />
      <LanguageSwitcher />
    </>
  )
}

