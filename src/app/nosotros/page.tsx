import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingChat from '@/components/ui/FloatingChat'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import AboutHero from '@/components/sections/AboutHero'
import Mission from '@/components/sections/Mission'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import Association from '@/components/sections/Association'

export const metadata: Metadata = {
  title: 'Nosotros - A&A Más Corredores de Seguros',
  description: 'Conoce más sobre A&A Más Corredores de Seguros. Somos profesionales independientes comprometidos con tu seguridad y confianza.',
  keywords: 'corredores de seguros, seguros chile, profesionales independientes, colegio corredores chile',
  openGraph: {
    title: 'Nosotros - A&A Más Corredores de Seguros',
    description: 'Conoce más sobre A&A Más Corredores de Seguros. Somos profesionales independientes comprometidos con tu seguridad y confianza.',
    url: 'https://segurosayamas.cl/nosotros',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <AboutHero />
      <Mission />
      <WhyChooseUs />
      <Association />
      <Footer />
      <FloatingChat />
      <WhatsAppButton variant="floating" />
    </main>
  )
}
