'use client'

import { useState } from 'react'
import { Newspaper, Calendar, Clock, User, Tag, Search, Filter } from 'lucide-react'
import { Carousel, NewsCarouselItem } from '@/components/carousel'

interface NewsCarouselSectionProps {
  title?: string
  subtitle?: string
  showFilter?: boolean
  itemsPerView?: number
  showSearch?: boolean
}

const NewsCarouselSection = ({ 
  title = "Noticias y Actualizaciones",
  subtitle = "Mantente informado con las últimas noticias del sector seguros",
  showFilter = true,
  itemsPerView = 2,
  showSearch = false
}: NewsCarouselSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'Todas las noticias', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'regulaciones', name: 'Regulaciones', icon: <Filter className="w-4 h-4" /> },
    { id: 'consejos', name: 'Consejos', icon: <User className="w-4 h-4" /> },
    { id: 'tecnologia', name: 'Tecnología', icon: <Tag className="w-4 h-4" /> },
    { id: 'empresa', name: 'Empresa', icon: <Calendar className="w-4 h-4" /> },
  ]

  const allNews = [
    {
      id: '1',
      title: 'Nuevas Regulaciones de Seguros 2025',
      subtitle: 'Cambios importantes que debes conocer',
      description: 'La Superintendencia de Valores y Seguros ha anunciado nuevas regulaciones que entrarán en vigor este año, beneficiando a los asegurados con mayor protección y transparencia en los productos de seguros.',
      image: '/api/placeholder/600/400',
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
      description: 'Conoce los factores clave que debes considerar al momento de contratar un seguro de vida y cómo elegir la cobertura que mejor se adapte a tus necesidades y presupuesto familiar.',
      image: '/api/placeholder/600/400',
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
      description: 'Descubre cómo la inteligencia artificial y el análisis de datos están transformando la industria de seguros, mejorando la experiencia del cliente y la evaluación de riesgos.',
      image: '/api/placeholder/600/400',
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
      description: 'Nuestra empresa ha alcanzado un récord histórico de satisfacción al cliente, consolidándose como líder en el mercado de seguros nacional gracias a nuestro servicio personalizado.',
      image: '/api/placeholder/600/400',
      date: '2025-01-02',
      author: 'Equipo A&A+',
      category: 'Empresa',
      readTime: '3 min',
      featured: true,
      href: '/noticias/record-satisfaccion'
    },
    {
      id: '5',
      title: 'Cómo Reclamar tu Seguro de Auto Correctamente',
      subtitle: 'Paso a paso para una reclamación exitosa',
      description: 'Aprende el proceso correcto para hacer una reclamación de seguro automotriz, qué documentos necesitas y cómo acelerar el proceso de indemnización.',
      image: '/api/placeholder/600/400',
      date: '2024-12-28',
      author: 'Roberto Silva',
      category: 'Consejos',
      readTime: '7 min',
      featured: false,
      href: '/noticias/reclamar-seguro-auto'
    },
    {
      id: '6',
      title: 'Expansión a Nuevas Regiones',
      subtitle: 'Llegamos a más ciudades de Chile',
      description: 'A&A+ Seguros continúa su expansión nacional abriendo nuevas oficinas en el sur del país, acercando nuestros servicios a más familias chilenas.',
      image: '/api/placeholder/600/400',
      date: '2024-12-20',
      author: 'Departamento Comercial',
      category: 'Empresa',
      readTime: '4 min',
      featured: false,
      href: '/noticias/expansion-regiones'
    }
  ]

  const filteredNews = allNews.filter(news => {
    const matchesCategory = selectedCategory === 'all' || news.category.toLowerCase() === selectedCategory
    const matchesSearch = searchTerm === '' || 
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
            {title}
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Search and Filter Controls */}
        {(showSearch || showFilter) && (
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
            {/* Search Bar */}
            {showSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            )}

            {/* Category Filter */}
            {showFilter && (
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-primary-50 hover:text-primary-500'
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* News Carousel */}
        <div className="relative">
          {filteredNews.length > 0 ? (
            <Carousel
              autoPlay={true}
              interval={7000}
              showDots={true}
              showArrows={true}
              itemsPerView={itemsPerView}
              className="lg:px-4"
            >
              {filteredNews.map((news, index) => (
                <div key={news.id} className={itemsPerView > 1 ? 'px-2' : ''}>
                  <NewsCarouselItem item={news} index={index} />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                No se encontraron noticias
              </h3>
              <p className="text-neutral-500">
                Intenta con otros términos de búsqueda o categorías
              </p>
            </div>
          )}
        </div>

        {/* Results Counter */}
        {filteredNews.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-neutral-600">
              Mostrando <span className="font-semibold text-primary-500">{filteredNews.length}</span> noticias
              {selectedCategory !== 'all' && (
                <span> en <span className="font-semibold text-primary-500">
                  {categories.find(cat => cat.id === selectedCategory)?.name}
                </span></span>
              )}
              {searchTerm && (
                <span> para "<span className="font-semibold text-primary-500">{searchTerm}</span>"</span>
              )}
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-800 mb-4">
              ¿Quieres estar siempre informado?
            </h3>
            <p className="text-neutral-600 mb-6">
              Suscríbete a nuestro newsletter y recibe las últimas noticias y consejos directamente en tu email.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="btn btn-primary px-6 py-3 whitespace-nowrap">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsCarouselSection
