'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

const SimpleCarouselTest = () => {
  const router = useRouter()

  const handleNavigation = (url?: string) => {
    console.log('🔗 Navegando a:', url)
    
    if (!url) {
      console.warn('⚠️  No hay URL para navegar')
      alert('No hay URL definida')
      return
    }
    
    // Si es una URL externa
    if (url.startsWith('http://') || url.startsWith('https://')) {
      console.log('🌐 Abriendo URL externa:', url)
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      // Si es una ruta interna
      console.log('🏠 Navegando a ruta interna:', url)
      router.push(url)
    }
  }

  const testSlide = {
    title: 'Test de Navegación',
    description: 'Probando la navegación de CTAs',
    ctaText: 'Ir a Google',
    ctaUrl: 'https://google.com',
    ctaSecondary: 'Ir a Admin',
    ctaSecondaryUrl: '/admin',
    backgroundColor: 'from-blue-600 to-blue-800'
  }

  return (
    <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="text-center text-white space-y-4">
        <h1 className="text-2xl font-bold">{testSlide.title}</h1>
        <p className="text-lg">{testSlide.description}</p>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Click en CTA principal')
              handleNavigation(testSlide.ctaUrl)
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <span>{testSlide.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Click en CTA secundario')
              handleNavigation(testSlide.ctaSecondaryUrl)
            }}
            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-all"
          >
            {testSlide.ctaSecondary}
          </button>
        </div>
        
        <div className="text-sm opacity-80 mt-4">
          <p>CTA Principal: {testSlide.ctaUrl}</p>
          <p>CTA Secundario: {testSlide.ctaSecondaryUrl}</p>
        </div>
      </div>
    </div>
  )
}

export default SimpleCarouselTest
