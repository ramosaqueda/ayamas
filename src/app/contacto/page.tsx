import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingChat from '@/components/ui/FloatingChat'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import Contact from '@/components/sections/Contact'

export const metadata: Metadata = {
  title: 'Contacto - A&A+ Ltda. Corredores de Seguros',
  description: 'Contáctanos para resolver tus consultas sobre seguros. Estamos prestos a responder y considerar tus sugerencias. WhatsApp disponible.',
  keywords: 'contacto, corredores seguros, consultas seguros, whatsapp seguros, asesoría seguros chile',
  openGraph: {
    title: 'Contacto - A&A+ Ltda. Corredores de Seguros',
    description: 'Contáctanos para resolver tus consultas sobre seguros. Estamos prestos a responder y considerar tus sugerencias.',
    url: 'https://segurosayamas.cl/contacto',
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 lg:pt-20">
        <Contact />
      </div>
      <Footer />
      <FloatingChat />
      <WhatsAppButton variant="floating" />
    </main>
  )
}
