'use client'

import { useState } from 'react'
import { ArrowRight, Check, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCarouselSlides } from '@/hooks'
import { ICarouselSlide } from '@/lib/models'
import { useRouter } from 'next/navigation'

const MainCarouselFixed = () => {
  const { slides, loading, error } = useCarouselSlides(true)
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Función para manejar navegación
  const handleNavigation = (url?: string) => {
    console.log('🔗 Navegando a:', url)
    
    if (!url) {
      console.warn('⚠️  No hay URL para navegar')
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

  // Datos de respaldo
  const fallbackSlides = [
    {
      _id: '1',
      title: 'Seguro de Vida Premium',
      subtitle: 'Protección Completa para tu Familia',
      description: 'El plan más completo con cobertura de vida, invalidez y enfermedades graves.',
      price: '$45.000',
      period: '/mes',
      features: [
        'Cobertura hasta $200.000.000',
        'Sin período de carencia',
        'Asistencia médica 24/7',
        'Beneficios por hospitalización'
      ],
      backgroundColor: 'from-blue-600 to-blue-800',
      badge: '25% OFF',
      ctaText: 'Cotizar Ahora',
      ctaUrl: 'https://google.com',
      ctaSecondary: 'Más Información',
      ctaSecondaryUrl: '/admin',
      stats: { rating: 4.9, clients: '15K+' },
      active: true,
      order: 1
    }
  ]

  const slidesToRender = slides.length > 0 ? slides : fallbackSlides
  const currentSlide = slidesToRender[currentIndex] || fallbackSlides[0]

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slidesToRender.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => prev === 0 ? slidesToRender.length - 1 : prev - 1)
  }

  if (loading) {
    return (
      <section className="relative w-full h-[70vh] min-h-[500px] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando carrusel...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full">
      <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        {/* Imagen de fondo */}
        {currentSlide.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentSlide.backgroundImage})`
            }}
          />
        )}

        {/* Overlay de gradiente */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentSlide.backgroundColor}`}
          style={{
            opacity: currentSlide.backgroundImage
              ? (1 - (currentSlide.backgroundOpacity || 0.2))
              : 1
          }}
        />

        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full py-12">
            {/* Content */}
            <div className="space-y-8">
              {/* Badge */}
              {currentSlide.badge && (
                <div className="inline-block">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    currentSlide.badge.includes('OFF')
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-400 text-gray-800'
                  }`}>
                    {currentSlide.badge}
                  </span>
                </div>
              )}

              {/* Title and Subtitle */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {currentSlide.title}
                </h1>
                {currentSlide.subtitle && (
                  <h2 className="text-xl md:text-2xl text-yellow-400 font-semibold">
                    {currentSlide.subtitle}
                  </h2>
                )}
                <p className="text-lg text-white/90 max-w-xl leading-relaxed">
                  {currentSlide.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {currentSlide.features?.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('🚀 Click en CTA principal:', currentSlide.ctaUrl)
                    handleNavigation(currentSlide.ctaUrl || currentSlide.href)
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold flex items-center gap-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                {currentSlide.ctaSecondary && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('🚀 Click en CTA secundario:', currentSlide.ctaSecondaryUrl)
                      handleNavigation(currentSlide.ctaSecondaryUrl || currentSlide.href)
                    }}
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm transform hover:scale-105"
                  >
                    {currentSlide.ctaSecondary}
                  </button>
                )}
              </div>

              {/* Stats */}
              {(currentSlide.stats?.rating || currentSlide.stats?.clients) && (
                <div className="flex items-center gap-6 text-white/90">
                  {currentSlide.stats.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{currentSlide.stats.rating}</span>
                    </div>
                  )}
                  {currentSlide.stats.clients && (
                    <div className="text-sm">
                      <span className="font-semibold">{currentSlide.stats.clients}</span> clientes confían en nosotros
                    </div>
                  )}
                </div>
              )}

              {/* Debug Info */}
              <div className="text-xs text-white/60 bg-black/20 p-2 rounded mt-4">
                <p>🔗 CTA Principal: {currentSlide.ctaUrl || 'No definido'}</p>
                <p>🔗 CTA Secundario: {currentSlide.ctaSecondaryUrl || 'No definido'}</p>
                <p>🔗 Href respaldo: {currentSlide.href || 'No definido'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        {slidesToRender.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {slidesToRender.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {slidesToRender.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default MainCarouselFixed
