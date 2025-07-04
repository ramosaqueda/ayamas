import Header from '@/components/layout/Header'
import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Products from '@/components/sections/Products'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'
import FloatingChat from '@/components/ui/FloatingChat'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Products />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingChat />
      <WhatsAppButton variant="floating" />
    </main>
  )
}
