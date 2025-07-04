import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingChat from '@/components/ui/FloatingChat'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import BrokerisSection from '@/components/sections/BrokerisSection'

export const metadata: Metadata = {
  title: 'Brokeris - Plataforma de Gestión de Pólizas y Siniestros | A&A+ Ltda.',
  description: 'Acceda a Brokeris, la moderna herramienta para gestión y consulta de pólizas y siniestros. Sistemas especializados para Holdings y Empresas.',
  keywords: 'brokeris, gestión pólizas, siniestros, holdings, empresas, plataforma seguros, sistema gestión',
  openGraph: {
    title: 'Brokeris - Plataforma de Gestión de Pólizas y Siniestros',
    description: 'La más moderna herramienta para la gestión y consulta de pólizas y siniestros. Acceso especializado para Holdings y Empresas.',
    url: 'https://segurosayamas.cl/brokeris',
  },
}

export default function BrokerisPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 lg:pt-20">
        <BrokerisSection />
      </div>
      <Footer />
      <FloatingChat />
      <WhatsAppButton variant="floating" />
    </main>
  )
}
