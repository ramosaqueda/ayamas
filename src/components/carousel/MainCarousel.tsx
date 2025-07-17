'use client'

import { Car, Building, Home, Heart, Sailboat, Stethoscope, Plane, Building2, PersonStanding, ArrowRight, Check, Star } from 'lucide-react'
import { Carousel } from '@/components/carousel'
import { motion } from 'framer-motion'
import { useCarouselSlides } from '@/hooks'
import { ICarouselSlide } from '@/lib/models'
import { getIcon } from '@/lib/iconUtils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const MainCarousel = () => {
  const { slides, loading, error } = useCarouselSlides(true)
  const router = useRouter()

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

  // Datos de respaldo en caso de que no haya slides en la BD
  const fallbackSlides = [
    {
      _id: '1',
      title: 'Seguro de Vida Premium',
      subtitle: 'Protección Completa para tu Familia',
      description: 'El plan más completo con cobertura de vida, invalidez y enfermedades graves. Protege lo que más amas con la mejor cobertura del mercado.',
      price: '$45.000',
      originalPrice: '$60.000',
      period: '/mes',
      features: [
        'Cobertura hasta $200.000.000',
        'Sin período de carencia',
        'Asistencia médica 24/7',
        'Beneficios por hospitalización'
      ],
      icon: 'person-standing',
      backgroundColor: 'from-blue-600 to-blue-800',
      badge: '25% OFF',
      ctaText: 'Cotizar Ahora',
      ctaSecondary: 'Más Información',
      ctaUrl: '/productos/seguro-vida-premium',
      ctaSecondaryUrl: '/seguros/vida/informacion',
      stats: { rating: 4.9, clients: '15K+' },
      active: true,
      order: 1
    },
    {
      _id: '2',
      title: 'Seguro Auto Total',
      subtitle: 'Protección Integral para tu Vehículo',
      description: 'Cobertura completa contra todo riesgo con la mejor atención en siniestros. Tu auto protegido las 24 horas del día.',
      price: '$38.000',
      period: '/mes',
      features: [
        'Todo riesgo franquicia 0',
        'Responsabilidad civil ilimitada',
        'Grúa y asistencia 24/7',
        'Auto de reemplazo incluido'
      ],
      icon: 'car',
      backgroundColor: 'from-red-600 to-red-800',
      badge: 'NUEVO',
      ctaText: 'Cotizar Auto',
      ctaSecondary: 'Ver Cobertura',
      ctaUrl: '/productos/seguro-auto-total',
      ctaSecondaryUrl: '/seguros/auto/cobertura',
      stats: { rating: 4.8, clients: '25K+' },
      active: true,
      order: 2
    },
    {
      _id: '3',
      title: 'Seguro Hogar Completo',
      subtitle: 'Tu Hogar Siempre Protegido',
      description: 'Protección integral contra incendio, robo, sismos y más. La tranquilidad de saber que tu hogar está seguro.',
      price: '$28.000',
      period: '/mes',
      features: [
        'Incendio, sismo y robo',
        'Responsabilidad civil',
        'Gastos de habitación',
        'Jardinería incluida'
      ],
      icon: 'home',
      backgroundColor: 'from-green-600 to-green-800',
      ctaText: 'Proteger Hogar',
      ctaSecondary: 'Calcular Prima',
      ctaUrl: '/productos/seguro-hogar-completo',
      ctaSecondaryUrl: '/calculadora/hogar',
      stats: { rating: 4.7, clients: '20K+' },
      active: true,
      order: 3
    }
  ]

  // Usar slides de la BD o datos de respaldo
  const slidesToRender = slides.length > 0 ? slides : fallbackSlides

  const renderSlide = (slide: ICarouselSlide | typeof fallbackSlides[0]) => (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      {/* Imagen de fondo */}
      {slide.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${slide.backgroundImage})`
          }}
        />
      )}

      {/* Overlay de gradiente con opacidad ajustable */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.backgroundColor}`}
        style={{
          opacity: slide.backgroundImage
            ? (1 - (slide.backgroundOpacity || 0.2))
            : 1
        }}
      />
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4K')] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 h-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center h-full py-12">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            {slide.badge && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block"
              >
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${slide.badge.includes('OFF')
                  ? 'bg-red-500 text-white'
                  : 'bg-secondary-500 text-neutral-800'
                  }`}>
                  {slide.badge}
                </span>
              </motion.div>
            )}

            {/* Title and Subtitle */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                {slide.title}
              </motion.h1>
              {slide.subtitle && (
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl text-secondary-500 font-semibold"
                >
                  {slide.subtitle}
                </motion.h2>
              )}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg text-white/90 max-w-xl leading-relaxed"
              >
                {slide.description}
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-3"
            >
              {slide.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <Check className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
              style={{ pointerEvents: 'auto' }}
            >
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleNavigation(slide.ctaUrl || slide.href)
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold flex items-center gap-2 group relative z-20 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ pointerEvents: 'auto' }}
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              {slide.ctaSecondary && (
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleNavigation(slide.ctaSecondaryUrl || slide.href)
                  }}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold relative z-20 rounded-lg transition-all duration-300 backdrop-blur-sm"
                  style={{ pointerEvents: 'auto' }}
                >
                  {slide.ctaSecondary}
                </button>
              )}
            </motion.div>

            {/* Stats */}
            {(slide.stats?.rating || slide.stats?.clients) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex items-center gap-6 text-white/90"
              >
                {slide.stats.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{slide.stats.rating}</span>
                  </div>
                )}
                {slide.stats.clients && (
                  <div className="text-sm">
                    <span className="font-semibold">{slide.stats.clients}</span> clientes confían en nosotros
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Price Card */}

        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-secondary-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  )

  // Mostrar loading
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

  // Mostrar error (usar datos de respaldo)
  if (error) {
    console.error('Error loading carousel:', error)
  }

  return (
    <section className="relative w-full">
      <Carousel
        autoPlay={true}
        interval={6000}
        showDots={true}
        showArrows={true}
        infinite={true}
        itemsPerView={1}
        className="hero-carousel"
      >
        {slidesToRender.map((slide) => (
          <div key={slide._id}>
            {renderSlide(slide)}
          </div>
        ))}
      </Carousel>

      {/* Trust Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-8 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center gap-2 text-neutral-700">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">Calificación AAA</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-700">
            <Building2 className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium">CMF Certificado</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-700">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <span className="text-sm font-medium">+50K Clientes</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainCarousel
