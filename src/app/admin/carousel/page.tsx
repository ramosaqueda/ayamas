'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, EyeOff, Move, GripVertical, Star, Users, Database } from 'lucide-react'
import { ICarouselSlide } from '@/lib/models/CarouselSlide'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import MigrationOpacity from '@/components/admin/MigrationOpacity'
import DiagnosticTool from '@/components/admin/DiagnosticTool'
import TransparencyTest from '@/components/admin/TransparencyTest'

interface CarouselResponse {
  success: boolean
  data: ICarouselSlide[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

const CarouselPage = () => {
  const router = useRouter()
  const [slides, setSlides] = useState<ICarouselSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; slide: ICarouselSlide | null }>({
    show: false,
    slide: null
  })
  const [draggedSlide, setDraggedSlide] = useState<ICarouselSlide | null>(null)

  const fetchSlides = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/carousel')
      
      if (!response.ok) {
        throw new Error('Error al cargar slides')
      }

      const data: CarouselResponse = await response.json()
      
      if (data.success) {
        setSlides(data.data)
      } else {
        throw new Error('Error en la respuesta del servidor')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching slides:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const handleDelete = async (slide: ICarouselSlide) => {
    try {
      const response = await fetch(`/api/carousel/${slide._id.toString()}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar slide')
      }

      setSlides(slides.filter(s => s._id.toString() !== slide._id.toString()))
      setDeleteModal({ show: false, slide: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const handleReorder = async (newOrder: ICarouselSlide[]) => {
    try {
      const slideIds = newOrder.map(slide => slide._id.toString())
      
      const response = await fetch('/api/carousel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slideIds })
      })

      if (!response.ok) {
        throw new Error('Error al reordenar slides')
      }

      setSlides(newOrder.map((slide, index) => ({
        _id: slide._id,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        price: slide.price,
        originalPrice: slide.originalPrice,
        period: slide.period,
        discount: slide.discount,
        features: slide.features,
        backgroundColor: slide.backgroundColor,
        backgroundImage: slide.backgroundImage,
        backgroundOpacity: slide.backgroundOpacity,
        badge: slide.badge,
        icon: slide.icon,
        ctaText: slide.ctaText,
        ctaUrl: slide.ctaUrl,
        ctaSecondary: slide.ctaSecondary,
        ctaSecondaryUrl: slide.ctaSecondaryUrl,
        href: slide.href,
        stats: slide.stats,
        active: slide.active,
        order: index,
        createdAt: slide.createdAt,
        updatedAt: slide.updatedAt
      } as ICarouselSlide)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reordenar')
    }
  }

  const handleDragStart = (e: React.DragEvent, slide: ICarouselSlide) => {
    setDraggedSlide(slide)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetSlide: ICarouselSlide) => {
    e.preventDefault()
    
    if (!draggedSlide || draggedSlide._id.toString() === targetSlide._id.toString()) {
      setDraggedSlide(null)
      return
    }

    const newSlides = [...slides]
    const draggedIndex = newSlides.findIndex(s => s._id.toString() === draggedSlide._id.toString())
    const targetIndex = newSlides.findIndex(s => s._id.toString() === targetSlide._id.toString())

    // Remover el slide arrastrado
    const [movedSlide] = newSlides.splice(draggedIndex, 1)
    // Insertarlo en la nueva posición
    newSlides.splice(targetIndex, 0, movedSlide)

    handleReorder(newSlides)
    setDraggedSlide(null)
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading && slides.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
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
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Carrusel</h1>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona los slides del carrusel principal
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/carousel/new')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Slide
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-900">{slides.length}</div>
            <div className="text-sm text-gray-600">Total slides</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">
              {slides.filter(s => s.active).length}
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-600">
              {slides.filter(s => !s.active).length}
            </div>
            <div className="text-sm text-gray-600">Inactivos</div>
          </div>
        </div>

        {/* Prueba de Transparencia */}
        <TransparencyTest />

        {/* Herramienta de Diagnóstico */}
        <DiagnosticTool />

        {/* Migración de Opacidad */}
        <MigrationOpacity />

        {/* Lista de Slides */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Slides del Carrusel</h2>
            <p className="text-sm text-gray-600 mt-1">
              Arrastra los slides para reordenarlos
            </p>
          </div>

          {slides.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No hay slides creados</div>
              <div className="text-gray-400 text-sm mb-4">
                Comienza creando tu primer slide del carrusel
              </div>
              <button
                onClick={() => router.push('/admin/carousel/new')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Slide
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {slides.map((slide, index) => (
                <div
                  key={slide._id.toString()}
                  draggable
                  onDragStart={(e) => handleDragStart(e, slide)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slide)}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-move ${
                    draggedSlide?._id.toString() === slide._id.toString() ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Drag Handle */}
                    <div className="flex-shrink-0">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative w-20 h-12 rounded overflow-hidden flex items-center justify-center text-white text-xs font-semibold">
                        {/* Imagen de fondo */}
                        {slide.backgroundImage && (
                          <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ 
                              backgroundImage: `url(${slide.backgroundImage})`
                            }}
                          />
                        )}
                        
                        {/* Overlay de gradiente con opacidad */}
                        <div 
                          className={`absolute inset-0 bg-gradient-to-br ${slide.backgroundColor}`}
                          style={{
                            opacity: slide.backgroundImage ? (1 - (slide.backgroundOpacity || 0.2)) : 1
                          }}
                        />
                        
                        <span className="relative z-10">#{index + 1}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {slide.title}
                        </h3>
                        {slide.badge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {slide.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {slide.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>{slide.price} {slide.period}</span>
                        {slide.stats && (
                          <>
                            <span className="flex items-center">
                              <Star className="w-3 h-3 mr-1" />
                              {slide.stats.rating}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {slide.stats.clients}
                            </span>
                          </>
                        )}
                        <span>Creado {slide.createdAt ? formatDate(slide.createdAt) : 'N/A'}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        slide.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {slide.active ? (
                          <><Eye className="w-3 h-3 mr-1" /> Activo</>
                        ) : (
                          <><EyeOff className="w-3 h-3 mr-1" /> Inactivo</>
                        )}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/admin/carousel/${slide._id.toString()}`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Ver slide"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/carousel/${slide._id.toString()}/edit`)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="Editar slide"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, slide })}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instrucción de reorden */}
        {slides.length > 1 && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Move className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Tip: Arrastra los slides usando el icono de puntos para reordenarlos
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmDelete
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, slide: null })}
        onConfirm={() => deleteModal.slide && handleDelete(deleteModal.slide)}
        title="Eliminar Slide"
        message={`¿Estás seguro de que deseas eliminar el slide "${deleteModal.slide?.title}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}

export default CarouselPage
