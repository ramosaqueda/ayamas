'use client'

import { useState } from 'react'
import { Car, Building, Home, Sailboat, Stethoscope, Plane, Building2, PersonStanding, Filter, Grid, List } from 'lucide-react'
import { Carousel, ProductCarouselItem } from '@/components/carousel'

interface ProductsCarouselSectionProps {
  showFilter?: boolean
  itemsPerView?: number
  title?: string
  subtitle?: string
}

const ProductsCarouselSection = ({ 
  showFilter = true, 
  itemsPerView = 3,
  title = "Nuestros Productos",
  subtitle = "Encuentra la protección perfecta para cada aspecto de tu vida"
}: ProductsCarouselSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid')

  const categories = [
    { id: 'all', name: 'Todos', icon: <Grid className="w-4 h-4" /> },
    { id: 'personal', name: 'Personales', icon: <PersonStanding className="w-4 h-4" /> },
    { id: 'empresarial', name: 'Empresariales', icon: <Building2 className="w-4 h-4" /> },
    { id: 'salud', name: 'Salud', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'especiales', name: 'Especiales', icon: <Sailboat className="w-4 h-4" /> },
  ]

  const allProducts = [
    {
      id: '1',
      icon: <PersonStanding className="w-6 h-6" />,
      title: 'Seguro de Vida',
      subtitle: 'Protección familiar',
      description: 'Protege a tu familia con nuestras coberturas de vida personalizadas',
      price: '$30.000',
      period: '/mes',
      features: [
        'Cobertura de vida',
        'Invalidez permanente',
        'Enfermedades graves',
        'Asistencia médica',
        'Sin carencia'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: true,
      category: 'personal',
      href: '/cotizar?producto=vida'
    },
    {
      id: '2',
      icon: <Car className="w-6 h-6" />,
      title: 'Seguro Automotriz',
      subtitle: 'Todo riesgo',
      description: 'Protección completa para tu vehículo con la mejor atención',
      price: '$35.000',
      period: '/mes',
      features: [
        'Todo riesgo',
        'Responsabilidad civil',
        'Robo y hurto',
        'Asistencia 24/7',
        'Auto reemplazo'
      ],
      color: 'from-red-500 to-red-600',
      popular: false,
      category: 'personal',
      href: '/cotizar?producto=auto'
    },
    {
      id: '3',
      icon: <Home className="w-6 h-6" />,
      title: 'Seguro Hogar',
      subtitle: 'Protección total',
      description: 'Tu hogar protegido contra incendio, robo, sismos y más',
      price: '$25.000',
      period: '/mes',
      features: [
        'Incendio y sismo',
        'Robo y hurto',
        'Daños por agua',
        'Responsabilidad civil',
        'Gastos adicionales'
      ],
      color: 'from-green-500 to-green-600',
      popular: false,
      category: 'personal',
      href: '/cotizar?producto=hogar'
    },
    {
      id: '4',
      icon: <Building2 className="w-6 h-6" />,
      title: 'Seguro Empresarial',
      subtitle: 'Negocios protegidos',
      description: 'Solución integral para proteger tu empresa y empleados',
      price: '$80.000',
      period: '/mes',
      features: [
        'Responsabilidad civil',
        'Protección patrimonial',
        'Interrupción negocio',
        'Fidelidad empleados',
        'Asesoría legal'
      ],
      color: 'from-purple-500 to-purple-600',
      popular: true,
      category: 'empresarial',
      href: '/cotizar?producto=empresarial'
    },
    {
      id: '5',
      icon: <Stethoscope className="w-6 h-6" />,
      title: 'Seguro de Salud',
      subtitle: 'Cobertura médica',
      description: 'Acceso a la mejor atención médica con amplia red de clínicas',
      price: '$45.000',
      period: '/mes',
      features: [
        'Consultas médicas',
        'Hospitalización',
        'Exámenes y cirugías',
        'Medicina preventiva',
        'Telemedicina'
      ],
      color: 'from-teal-500 to-teal-600',
      popular: false,
      category: 'salud',
      href: '/cotizar?producto=salud'
    },
    {
      id: '6',
      icon: <Plane className="w-6 h-6" />,
      title: 'Seguro de Viaje',
      subtitle: 'Viaja tranquilo',
      description: 'Protección completa para tus viajes nacionales e internacionales',
      price: '$15.000',
      period: '/viaje',
      features: [
        'Gastos médicos',
        'Cancelación viaje',
        'Equipaje perdido',
        'Repatriación',
        'Asistencia 24/7'
      ],
      color: 'from-orange-500 to-orange-600',
      popular: false,
      category: 'especiales',
      href: '/cotizar?producto=viaje'
    },
    {
      id: '7',
      icon: <Sailboat className="w-6 h-6" />,
      title: 'Seguro Náutico',
      subtitle: 'Embarcaciones',
      description: 'Protección para yates, lanchas y embarcaciones deportivas',
      price: '$60.000',
      period: '/mes',
      features: [
        'Casco y maquinaria',
        'Responsabilidad civil',
        'Asistencia marítima',
        'Equipos navegación',
        'Remolque'
      ],
      color: 'from-cyan-500 to-cyan-600',
      popular: false,
      category: 'especiales',
      href: '/cotizar?producto=nautico'
    },
    {
      id: '8',
      icon: <Building className="w-6 h-6" />,
      title: 'Seguro Condominio',
      subtitle: 'Comunidades',
      description: 'Protección integral para condominios y comunidades',
      price: '$40.000',
      period: '/mes',
      features: [
        'Áreas comunes',
        'Responsabilidad civil',
        'Ascensores',
        'Piscinas',
        'Administración'
      ],
      color: 'from-indigo-500 to-indigo-600',
      popular: false,
      category: 'empresarial',
      href: '/cotizar?producto=condominio'
    }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory)

  const getItemsToShow = () => {
    if (viewMode === 'single') return 1
    if (itemsPerView <= 1) return 1
    if (itemsPerView >= 4) return 4
    return itemsPerView
  }

  return (
    <section className="py-20 bg-neutral-50">
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

        {/* Filters and View Controls */}
        {showFilter && (
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-500'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-600 hover:text-primary-500'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Vista Grid</span>
              </button>
              <button
                onClick={() => setViewMode('single')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  viewMode === 'single'
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-600 hover:text-primary-500'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Vista Individual</span>
              </button>
            </div>
          </div>
        )}

        {/* Products Carousel */}
        <div className="relative">
          <Carousel
            autoPlay={viewMode === 'single'}
            interval={4000}
            showDots={true}
            showArrows={true}
            itemsPerView={getItemsToShow()}
            className="lg:px-4"
          >
            {filteredProducts.map((product) => (
              <div key={product.id} className={viewMode === 'grid' ? 'px-2' : ''}>
                <ProductCarouselItem {...product} />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Results Counter */}
        <div className="text-center mt-8">
          <p className="text-neutral-600">
            Mostrando <span className="font-semibold text-primary-500">{filteredProducts.length}</span> productos
            {selectedCategory !== 'all' && (
              <span> en la categoría <span className="font-semibold text-primary-500">
                {categories.find(cat => cat.id === selectedCategory)?.name}
              </span></span>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProductsCarouselSection
