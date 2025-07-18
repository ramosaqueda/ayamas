'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { useProducts } from '@/hooks'
import { getIcon } from '@/lib/iconUtils'

const Products = () => {
  const [activeProduct, setActiveProduct] = useState<string | null>(null)
  const { products, loading, error } = useProducts({ active: true })

  // Datos de respaldo en caso de que no haya productos en la BD
  const fallbackProducts = [
    {
      _id: '1',
      title: 'Seguros Personales',
      description: 'Protege tu hogar y tu familia con nuestras coberturas personalizadas',
      price: 'Desde $30.000',
      period: '/mes',
      features: [
        'Seguros de Vida con inversión o ahorro',
        'Seguros de Vida de Protección y Salud',
        'Seguro Hogar Protegido (Incendio y Sismo, Robo)',
        'Seguro Automotriz (Daños Propios y Terceros, Robo)',
        'Seguro de Responsabilidad Civil',
      ],
      icon: 'person-standing',
      color: 'from-green-500 to-green-600',
      category: 'personal',
      popular: true,
      active: true
    },
    {
      _id: '2',
      title: 'Seguros Empresariales',
      description: 'Protege tu negocio con nuestras soluciones integrales',
      price: 'Desde $50.000',
      period: '/mes',
      features: [
        'Seguro de vehículos comerciales livianos',
        'Seguro de vehículos comerciales pesados',
        'Seguro de flota de vehículos',
        'Seguro de responsabilidad civil máxima',
        'Seguro de viajes específicos para empresas',
        'Seguro pólizas por proyectos',
      ],
      icon: 'building2',
      color: 'from-purple-500 to-purple-600',
      category: 'empresarial',
      popular: false,
      active: true
    },
    {
      _id: '3',
      title: 'Seguro de Colectivos',
      description: 'Cubre tus gastos médicos y hospitalarios con nuestra amplia red de clínicas',
      price: 'Desde $25.000',
      period: '/mes',
      features: [
        'Seguro complementario de salud y vida',
        'Seguros catastróficos',
        'Seguros de accidentes personales',
        'Seguros dentales',
        'Planes familiares disponibles'
      ],
      icon: 'stethoscope',
      color: 'from-orange-500 to-orange-600',
      category: 'salud',
      popular: false,
      active: true
    },
    {
      _id: '4',
      title: 'Seguros Especiales',
      description: 'Tenemos seguros para cada necesidad, desde viajes hasta eventos especiales',
      price: 'Desde $20.000',
      period: '/mes',
      features: [
        'Seguro agrícola',
        'Seguro casco marítimo',
        'Seguro yates',
        'Seguro garantía y crédito',
      ],
      icon: 'sailboat',
      color: 'from-teal-500 to-teal-600',
      category: 'especiales',
      popular: false,
      active: true
    },
    {
      _id: '5',
      title: 'Seguro Condominios',
      description: 'Maximizamos la seguridad de tu comunidad con nuestras pólizas de condominios',
      price: 'Desde $45.000',
      period: '/mes',
      features: [
        'Incendio, sismo y robo',
        'Responsabilidad civil',
        'Accidentes personales',
        'Riesgos de la naturaleza',
        'Rotura de cañerías',
        'Avería de maquinarias',
        'Rotura de cristales de áreas comunes',
        'Riesgos políticos y sociales',
        'Asistencias áreas comunes',
      ],
      icon: 'building',
      color: 'from-blue-500 to-blue-600',
      category: 'condominios',
      popular: true,
      active: true
    },
    {
      _id: '6',
      title: 'Seguros Obligatorios',
      description: 'La tranquilidad de cumplir con la ley y protegerte a ti y a los demás',
      price: 'Desde $15.000',
      period: '/mes',
      features: [
        'Seguro de vida conductores',
        'Seguros de responsabilidad civil internacional',
        'Seguros de viajes y asistencia al viajero',
        'Seguros de vigilantes y guardias',
        'Seguro de accidentes personales en viaje'
      ],
      icon: 'plane',
      color: 'from-red-500 to-red-600',
      category: 'obligatorios',
      popular: false,
      active: true
    },
  ]

  // Usar productos de la BD o datos de respaldo
  const productsToRender = products.length > 0 ? products : fallbackProducts

  // Mostrar loading
  if (loading) {
    return (
      <section id="productos" className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p>Cargando productos...</p>
          </div>
        </div>
      </section>
    )
  }

  // Mostrar error (usar datos de respaldo)
  if (error) {
    console.error('Error loading products:', error)
  }

  return (
    <section id="productos" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
            Nuestros Productos
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Encuentra la protección perfecta para cada aspecto de tu vida
          </p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsToRender.map((product) => (
            <div
              key={product._id}
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-ayamas-xl transition-all duration-300 overflow-hidden ${activeProduct === product._id ? 'ring-2 ring-primary-500' : ''
                }`}
              onMouseEnter={() => setActiveProduct(product._id)}
              onMouseLeave={() => setActiveProduct(null)}
            >
              {/* Popular Badge */}
              {product.popular && (
                <div className="absolute top-0 right-0 bg-secondary-500 text-neutral-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MÁS POPULAR
                </div>
              )}

              {/* Card Content */}
              <div className="p-8">
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${product.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    {getIcon(product.icon, "w-8 h-8")}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-500">
                      {product.price}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {product.period}
                    </div>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-neutral-800 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                    Incluye:
                  </h4>
                  <ul className="space-y-2">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-neutral-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {product.features.length > 4 && (
                    <div className="text-sm text-primary-500 mt-2">
                      +{product.features.length - 4} tipos más de seguros
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <span>Cotizar</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-800 mb-4">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-neutral-600 mb-6">
              Contamos con soluciones personalizadas para necesidades específicas.
              Nuestros expertos te ayudarán a encontrar la protección perfecta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary px-8 py-3">
                Hablar con un Experto
              </button>
              <button className="btn btn-outline px-8 py-3">
                Ver Todos los Productos
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products
