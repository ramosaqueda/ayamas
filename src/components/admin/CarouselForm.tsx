'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, X, Star, Users } from 'lucide-react'
import { ICarouselSlide } from '@/lib/models/CarouselSlide'
import ImageUploader from '@/components/admin/ImageUploader'

interface CarouselFormProps {
  slide?: Partial<ICarouselSlide>
  isEditing?: boolean
}

const BACKGROUND_OPTIONS = [
  { value: 'from-blue-600 to-blue-800', label: 'Azul', preview: 'bg-gradient-to-br from-blue-600 to-blue-800' },
  { value: 'from-green-600 to-green-800', label: 'Verde', preview: 'bg-gradient-to-br from-green-600 to-green-800' },
  { value: 'from-purple-600 to-purple-800', label: 'Morado', preview: 'bg-gradient-to-br from-purple-600 to-purple-800' },
  { value: 'from-orange-600 to-orange-800', label: 'Naranja', preview: 'bg-gradient-to-br from-orange-600 to-orange-800' },
  { value: 'from-teal-600 to-teal-800', label: 'Verde azulado', preview: 'bg-gradient-to-br from-teal-600 to-teal-800' },
  { value: 'from-red-600 to-red-800', label: 'Rojo', preview: 'bg-gradient-to-br from-red-600 to-red-800' },
  { value: 'from-indigo-600 to-indigo-800', label: 'Índigo', preview: 'bg-gradient-to-br from-indigo-600 to-indigo-800' },
  { value: 'from-pink-600 to-pink-800', label: 'Rosa', preview: 'bg-gradient-to-br from-pink-600 to-pink-800' },
  { value: 'from-gray-800 to-gray-900', label: 'Gris oscuro', preview: 'bg-gradient-to-br from-gray-800 to-gray-900' }
]

const ICON_OPTIONS = [
  'shield', 'car', 'building', 'home', 'heart', 'stethoscope', 'plane', 'building2',
  'person-standing', 'users', 'umbrella', 'truck', 'map-pin', 'phone', 'mail',
  'star', 'award', 'trending-up', 'zap', 'clock', 'sailboat'
]

const CarouselForm = ({ slide, isEditing = false }: CarouselFormProps) => {
  // Estilos CSS para el slider personalizado
  const sliderStyles = `
    .slider::-webkit-slider-thumb {
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #2563eb;
      cursor: pointer;
    }
    
    .slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #2563eb;
      cursor: pointer;
      border: none;
    }
  `
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    description: slide?.description || '',
    price: slide?.price || '',
    originalPrice: slide?.originalPrice || '',
    period: slide?.period || '/mes',
    features: slide?.features || [''],
    icon: slide?.icon || 'shield',
    backgroundColor: slide?.backgroundColor || 'from-blue-600 to-blue-800',
    backgroundImage: slide?.backgroundImage || '',
    backgroundOpacity: slide?.backgroundOpacity ?? 0.2,
    badge: slide?.badge || '',
    discount: slide?.discount || '',
    ctaText: slide?.ctaText || 'Cotizar Ahora',
    ctaSecondary: slide?.ctaSecondary || 'Más Información',
    ctaUrl: slide?.ctaUrl || '',
    ctaSecondaryUrl: slide?.ctaSecondaryUrl || '',
    stats: {
      rating: slide?.stats?.rating || undefined,
      clients: slide?.stats?.clients || ''
    },
    active: slide?.active ?? true,
    order: slide?.order || 0,
    href: slide?.href || ''
  })

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('stats.')) {
      const statField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        stats: { ...prev.stats, [statField]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    if (formData.features.length < 4) {
      setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
    }
  }

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, features: newFeatures }))
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) return 'El título es obligatorio'
    if (!formData.description.trim()) return 'La descripción es obligatoria'
    if (!formData.ctaText.trim()) return 'El texto del CTA principal es obligatorio'
    // CTA secundario ya no es obligatorio
    if (formData.features.filter(f => f.trim()).length === 0) return 'Debe tener al menos una característica'
    if (formData.stats.rating !== undefined && (formData.stats.rating < 1 || formData.stats.rating > 5)) return 'La calificación debe estar entre 1 y 5'
    if (formData.backgroundOpacity < 0 || formData.backgroundOpacity > 1) return 'La opacidad debe estar entre 0 y 1'
    
    // Validar URLs si se proporcionan
    const urlPattern = /^(https?:\/\/|\/).*$/
    if (formData.ctaUrl && !urlPattern.test(formData.ctaUrl)) {
      return 'La URL del CTA principal debe comenzar con http://, https:// o /'
    }
    if (formData.ctaSecondaryUrl && !urlPattern.test(formData.ctaSecondaryUrl)) {
      return 'La URL del CTA secundario debe comenzar con http://, https:// o /'
    }
    if (formData.href && !urlPattern.test(formData.href)) {
      return 'El enlace debe comenzar con http://, https:// o /'
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const cleanedData = {
        ...formData,
        features: formData.features.filter(feature => feature.trim().length > 0).slice(0, 4),
        backgroundOpacity: formData.backgroundOpacity // Asegurar que siempre se incluya
      }

      const url = isEditing ? `/api/carousel/${slide?._id}` : '/api/carousel'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al guardar el slide')
      }

      router.push('/admin/carousel')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </button>
              <div className="ml-4 border-l border-gray-300 pl-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Editar Slide' : 'Nuevo Slide'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vista Previa Inicial */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Vista Previa</h2>
            
            <div className="relative rounded-lg overflow-hidden h-64 text-white">
              {/* Imagen de fondo */}
              {formData.backgroundImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${formData.backgroundImage})`
                  }}
                />
              )}
              
              {/* Overlay de gradiente con opacidad ajustable */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${formData.backgroundColor}`}
                style={{
                  opacity: formData.backgroundImage ? (1 - formData.backgroundOpacity) : 1
                }}
              />
              
              <div className="relative h-full p-6 flex flex-col justify-between">
                <div>
                  {formData.badge && (
                    <span className="inline-block bg-white bg-opacity-20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {formData.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2">{formData.title || 'Título del slide'}</h3>
                  {formData.subtitle && (
                    <p className="text-sm opacity-90 mb-2">{formData.subtitle}</p>
                  )}
                  <p className="text-sm opacity-80">{formData.description || 'Descripción del slide'}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  {formData.price && (
                    <div>
                      <div className="text-2xl font-bold">{formData.price}</div>
                      <div className="text-sm opacity-80">{formData.period}</div>
                    </div>
                  )}
                  
                  {(formData.stats.rating || formData.stats.clients) && (
                    <div className={`${formData.price ? 'text-right' : 'text-left'}`}>
                      {formData.stats.rating && (
                        <div className="flex items-center text-sm mb-1">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          {formData.stats.rating}
                        </div>
                      )}
                      {formData.stats.clients && (
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          {formData.stats.clients}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información Básica */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Título del slide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Subtítulo opcional"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción del slide"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Desde $30.000 (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Original
                </label>
                <input
                  type="text"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="$50.000 (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período
                </label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => handleInputChange('period', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/mes (opcional)"
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Los campos de precio son opcionales. Útiles para productos destacados, pero pueden omitirse para noticias, categorías o contenido general.
              </p>
            </div>
          </div>

          {/* Configuración Visual */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configuración Visual</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {ICON_OPTIONS.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <ImageUploader
                  label="Imagen de Fondo"
                  value={formData.backgroundImage}
                  onChange={(url) => handleInputChange('backgroundImage', url)}
                  className=""
                />
              </div>
            </div>

            {formData.backgroundImage && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transparencia de la Imagen: {Math.round(formData.backgroundOpacity * 100)}%
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.backgroundOpacity}
                    onChange={(e) => handleInputChange('backgroundOpacity', parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-gray-500">100%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Controla cuánto se ve la imagen de fondo. 0% = solo color, 100% = solo imagen.
                </p>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Fondo
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {BACKGROUND_OPTIONS.map(bg => (
                  <button
                    key={bg.value}
                    type="button"
                    onClick={() => handleInputChange('backgroundColor', bg.value)}
                    className={`flex flex-col items-center p-3 border rounded-lg transition-all ${
                      formData.backgroundColor === bg.value 
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-full h-12 rounded ${bg.preview} mb-2`}></div>
                    <span className="text-xs text-center">{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA y Badges */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Llamadas a la Acción</h2>
            
            <div className="space-y-6">
              {/* CTA Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto CTA Principal *
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => handleInputChange('ctaText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cotizar Ahora"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL CTA Principal
                  </label>
                  <input
                    type="text"
                    value={formData.ctaUrl}
                    onChange={(e) => handleInputChange('ctaUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/productos/id o https://ejemplo.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puede ser una ruta interna (/productos/id) o URL externa (https://...)
                  </p>
                </div>
              </div>

              {/* CTA Secundario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto CTA Secundario
                  </label>
                  <input
                    type="text"
                    value={formData.ctaSecondary}
                    onChange={(e) => handleInputChange('ctaSecondary', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Más Información (opcional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL CTA Secundario
                  </label>
                  <input
                    type="text"
                    value={formData.ctaSecondaryUrl}
                    onChange={(e) => handleInputChange('ctaSecondaryUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/acerca-de o https://ejemplo.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puede ser una ruta interna (/acerca-de) o URL externa (https://...)
                  </p>
                </div>
              </div>

              {/* Badges y otros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => handleInputChange('badge', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="NUEVO, POPULAR, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descuento
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => handleInputChange('discount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="20% OFF"
                  />
                </div>
              </div>

              {/* Enlace general (href) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace General (Alternativo)
                </label>
                <input
                  type="text"
                  value={formData.href}
                  onChange={(e) => handleInputChange('href', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/categoria/destacados o https://ejemplo.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solo se usará si no se definen URLs específicas para los CTAs
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Estadísticas (Opcional)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Las estadísticas son opcionales. Útiles para productos destacados pero no necesarias para noticias o categorías.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.stats.rating || ''}
                  onChange={(e) => handleInputChange('stats.rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="4.8 (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clientes
                </label>
                <input
                  type="text"
                  value={formData.stats.clients}
                  onChange={(e) => handleInputChange('stats.clients', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10K+ (opcional)"
                />
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Características (Máximo 4)</h2>
              <button
                type="button"
                onClick={addFeature}
                disabled={formData.features.length >= 4}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </button>
            </div>

            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Característica ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configuración</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-6 pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Activo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditing ? 'Actualizar' : 'Crear'} Slide
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CarouselForm
