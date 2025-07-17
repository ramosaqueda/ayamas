'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Star, Users, Calendar, Tag } from 'lucide-react'
import { ICarouselSlide } from '@/lib/models/CarouselSlide'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import { getIcon } from '@/lib/iconUtils'

const CarouselSlideDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const [slide, setSlide] = useState<ICarouselSlide | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    const fetchSlide = async () => {
      try {
        const response = await fetch(`/api/carousel/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Error al cargar el slide')
        }

        const data = await response.json()
        
        if (data.success) {
          setSlide(data.data)
        } else {
          throw new Error(data.message || 'Error al cargar el slide')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching slide:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSlide()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (!slide) return

    try {
      const response = await fetch(`/api/carousel/${slide._id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar slide')
      }

      router.push('/admin/carousel')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={() => router.push('/admin/carousel')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Carrusel
          </button>
        </div>
      </div>
    )
  }

  if (!slide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Slide no encontrado</div>
          <button
            onClick={() => router.push('/admin/carousel')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Carrusel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/carousel')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Carrusel
              </button>
              <div className="ml-4 border-l border-gray-300 pl-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  {slide.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Slide del carrusel principal
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/admin/carousel/${slide._id}/edit`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </button>
              <button
                onClick={() => setDeleteModal(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vista Previa Grande */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h2>
              </div>
              
              <div className={`relative h-80 bg-gradient-to-br ${slide.backgroundColor} text-white`}>
                {slide.backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${slide.backgroundImage})` }}
                  />
                )}
                
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div>
                    {slide.badge && (
                      <span className="inline-block bg-white bg-opacity-20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
                        {slide.badge}
                      </span>
                    )}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        {getIcon(slide.icon, "w-12 h-12 text-white")}
                      </div>
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{slide.title}</h1>
                        {slide.subtitle && (
                          <p className="text-lg opacity-90 mb-3">{slide.subtitle}</p>
                        )}
                        <p className="text-base opacity-80">{slide.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-bold">{slide.price}</div>
                      {slide.originalPrice && (
                        <div className="text-lg opacity-75 line-through">{slide.originalPrice}</div>
                      )}
                      <div className="text-lg opacity-80">{slide.period}</div>
                      {slide.discount && (
                        <div className="text-sm bg-red-500 text-white px-2 py-1 rounded mt-1 inline-block">
                          {slide.discount}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center text-lg mb-2">
                        <Star className="w-5 h-5 mr-2 fill-current" />
                        {slide.stats.rating}
                      </div>
                      <div className="flex items-center text-lg">
                        <Users className="w-5 h-5 mr-2" />
                        {slide.stats.clients}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Características */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Características
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {slide.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Botones de Acción
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  {slide.ctaText}
                </button>
                <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  {slide.ctaSecondary}
                </button>
              </div>
            </div>

            {/* Enlaces */}
            {slide.href && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Enlace de Destino
                </h3>
                <a 
                  href={slide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {slide.href}
                </a>
              </div>
            )}
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Estado y Configuración */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Estado
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Estado</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    slide.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {slide.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Orden</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {slide.order}
                  </span>
                </div>
              </div>
            </div>

            {/* Configuración Visual */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración Visual
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Color de Fondo
                  </label>
                  <div className={`w-full h-8 rounded bg-gradient-to-r ${slide.backgroundColor}`}></div>
                  <code className="text-xs text-gray-500 mt-1 block">{slide.backgroundColor}</code>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Icono
                  </label>
                  <div className="flex items-center space-x-2">
                    {getIcon(slide.icon, "w-6 h-6 text-gray-600")}
                    <span className="text-sm text-gray-600">{slide.icon}</span>
                  </div>
                </div>

                {slide.backgroundImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Imagen de Fondo
                    </label>
                    <img 
                      src={slide.backgroundImage} 
                      alt="Background"
                      className="w-full h-24 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1 break-all">
                      {slide.backgroundImage}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Metadatos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Información del Sistema
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    ID del Slide
                  </label>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">
                    {slide._id}
                  </code>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Fecha de Creación
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(slide.createdAt)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Última Actualización
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(slide.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmDelete
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Slide"
        message={`¿Estás seguro de que deseas eliminar el slide "${slide.title}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}

export default CarouselSlideDetailPage
