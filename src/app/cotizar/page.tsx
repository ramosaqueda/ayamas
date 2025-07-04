import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingChat from '@/components/ui/FloatingChat'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import QuoteSection from '@/components/sections/QuotePage'

export const metadata: Metadata = {
  title: 'Cotizar Seguro - A&A+ Ltda. Corredores de Seguros',
  description: 'Obtén una cotización personalizada para tu seguro. Auto, hogar, vida, salud, viaje y empresarial. Respuesta en 24 horas.',
  keywords: 'cotizar seguro, cotización seguros chile, seguro auto, seguro hogar, seguro vida, presupuesto seguros',
  openGraph: {
    title: 'Cotizar Seguro - A&A+ Ltda. Corredores de Seguros',
    description: 'Obtén una cotización personalizada para el seguro que necesitas. Completa el formulario y te contactaremos con la mejor propuesta.',
    url: 'https://segurosayamas.cl/cotizar',
  },
}

export default function QuotePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 lg:pt-20">
        <QuoteSection />
      </div>
      <Footer />
      <FloatingChat />
      <WhatsAppButton variant="floating" />
    </main>
  )
}
