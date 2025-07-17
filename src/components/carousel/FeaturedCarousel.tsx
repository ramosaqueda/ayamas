'use client'

import { useState } from 'react'
import { Car, Building, Home, Heart, Sailboat, Stethoscope, Plane, Building2, PersonStanding, Newspaper, TrendingUp, Award, Users } from 'lucide-react'
import { Carousel, NewsCarouselItem, ProductCarouselItem } from '@/components/carousel'

const FeaturedCarousel = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'news'>('products')

  // Datos de productos destacados
  const featuredProducts = [
    {
      id: '1',
      icon: <PersonStanding className="w-8 h-8" />,
      title: 'Seguro de Vida Premium',
      subtitle: 'Protección completa para tu familia',
      description: 'El plan más completo con cobertura de vida, invalidez y enfermedades graves',
      price: '$45.000',
      originalPrice: '$60.000',
      period: '/mes',
      features: [
        'Cobertura de vida hasta $200.000.000',
        'Invalidez total y permanente',
        'Enfermedades graves cubiertas',
        'Beneficios por hospitalización',
        'Asistencia médica 24/7',
        'Sin período de carencia'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: true,
      discount: '25% OFF',
      href: '/cotizar?producto=vida-premium'
    },
    {
      id: '2',
      icon: <Car className="w-8 h-8" />,
      title: 'Seguro Auto Total',
      subtitle: 'Protección integral para tu vehículo',
      description: 'Cobertura completa contra todo riesgo con la mejor atención en siniestros',
      price: '$38.000',
      period: '/mes',
      features: [
        'Todo riesgo con franquicia 0',
        'Responsabilidad civil ilimitada',
        'Robo y hurto total',
        'Daños por fenómenos naturales',
        'Grúa y asistencia 24/7',
        'Auto de reemplazo'
      ],
      color: 'from-red-500 to-red-600',
      popular: false,
      badge: 'NUEVO',
      href: '/cotizar?producto=auto-total'
    },
    {
      id: '3',
      icon: <Building className="w-8 h-8" />,
      title: 'Seguro Hogar Completo',
      subtitle: 'Tu hogar siempre protegido',
      description: 'Protección integral para tu hogar contra incendio, robo, sismos y más',
      price: '$28.000',
      period: '/mes',
      features: [
        'Incendio y explosion',
        'Robo y hurto',
        'Daños por agua',
        'Responsabilidad civil',
        'Gastos de habitación',
        'Jardinería y paisajismo'
      ],
      color: 'from-green-500 to-green-600',
      popular: false,
      href: '/cotizar?producto=hogar-completo'
    },
    {
      id: '4',
      icon: <Building2 className="w-8 h-8" />,
      title: 'Seguro Empresarial',
      subtitle: 'Protege tu negocio',
      description: 'Solución integral para empresas con cobertura de responsabilidad civil y patrimonio',
      price: '$85.000',
      period: '/mes',
      features: [
        'Responsabilidad civil empresarial',
        'Protección de activos',
        'Interrupción de negocio',
        'Fidelidad de empleados',
        'Transporte de mercancías',
        'Asesoría legal incluida'
      ],
      color: 'from-purple-500 to-purple-600',
      popular: false,
      href: '/cotizar?producto=empresarial'
    }
  ]

  // Datos de noticias destacadas
  const featuredNews = [
    {
      id: '1',
      title: 'Nuevas Regulaciones de Seguros 2025',
      subtitle: 'Cambios importantes que debes conocer',
      description: 'La Superintendencia de Valores y Seguros ha anunciado nuevas regulaciones que entrarán en vigor este año, beneficiando a los asegurados con mayor protección y transparencia.',
      image: '/api/placeholder/400/300',
      date: '2025-01-15',
      author: 'María González',
      category: 'Regulaciones',
      readTime: '5 min',
      featured: true,
      href: '/noticias/regulaciones-2025'
    },
    {
      id: '2',
      title: 'Consejos para Elegir el Mejor Seguro de Vida',
      subtitle: 'Guía completa para tomar la mejor decisión',
      description: 'Conoce los factores clave que debes considerar al momento de contratar un seguro de vida y cómo elegir la cobertura que mejor se adapte a tus necesidades.',
      image: '/api/placeholder/400/300',
      date: '2025-01-10',
      author: 'Carlos Rodríguez',
      category: 'Consejos',
      readTime: '8 min',
      featured: false,
      href: '/noticias/consejos-seguro-vida'
    },
    {
      id: '3',
      title: 'Tecnología e Innovación en Seguros',
      subtitle: 'El futuro de la industria aseguradora',
      description: 'Descubre cómo la inteligencia artificial y el análisis de datos están transformando la industria de seguros, mejorando la experiencia del cliente.',
      image: '/api/placeholder/400/300',
      date: '2025-01-05',
      author: 'Ana Martínez',
      category: 'Tecnología',
      readTime: '6 min',
      featured: false,
      href: '/noticias/tecnologia-seguros'
    },
    {
      id: '4',
      title: 'Récord de Satisfacción al Cliente',
      subtitle: 'A&A+ Seguros alcanza el 98% de satisfacción',
      description: 'Nuestra empresa ha alcanzado un récord histórico de satisfacción al cliente, consolidándose como líder en el mercado de seguros nacional.',
      image: '/api/placeholder/400/300',
      date: '2025-01-02',
      author: 'Equipo A&A+',
      category: 'Empresa',
      readTime: '3 min',
      featured: true,
      href: '/noticias/record-satisfaccion'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-neutral-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
            Destacados
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
            Descubre nuestros productos más populares y mantente informado con las últimas noticias
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'products'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-neutral-600 hover:text-primary-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Productos Destacados</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'news'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-neutral-600 hover:text-primary-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5" />
                  <span>Noticias</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative">
          {activeTab === 'products' ? (
            <Carousel
              autoPlay={true}
              interval={5000}
              showDots={true}
              showArrows={true}
              itemsPerView={1}
              className="lg:px-8"
            >
              {featuredProducts.map((product, index) => (
                <ProductCarouselItem key={product.id} {...product} />
              ))}
            </Carousel>
          ) : (
            <Carousel
              autoPlay={true}
              interval={6000}
              showDots={true}
              showArrows={true}
              itemsPerView={1}
              className="lg:px-8"
            >
              {featuredNews.map((news, index) => (
                <NewsCarouselItem key={news.id} item={news} index={index} />
              ))}
            </Carousel>
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-500" />
            </div>
            <div className="text-3xl font-bold text-primary-500 mb-2">50K+</div>
            <div className="text-neutral-600">Clientes Satisfechos</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <Award className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-500 mb-2">98%</div>
            <div className="text-neutral-600">Satisfacción</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-500 mb-2">15+</div>
            <div className="text-neutral-600">Años de Experiencia</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
              <Building2 className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
            <div className="text-neutral-600">Atención al Cliente</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCarousel
