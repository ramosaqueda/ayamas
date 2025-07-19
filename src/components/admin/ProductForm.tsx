'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { IProduct } from '@/lib/models/Product'
import { ICategory } from '@/lib/models/Category'
import ImageUploader from './ImageUploader'

interface ProductFormProps {
  product?: Partial<IProduct>
  isEditing?: boolean
}

const COLOR_OPTIONS = [
  { value: 'from-blue-500 to-blue-600', label: 'Azul', preview: 'bg-gradient-to-r from-blue-500 to-blue-600' },
  { value: 'from-green-500 to-green-600', label: 'Verde', preview: 'bg-gradient-to-r from-green-500 to-green-600' },
  { value: 'from-purple-500 to-purple-600', label: 'Morado', preview: 'bg-gradient-to-r from-purple-500 to-purple-600' },
  { value: 'from-orange-500 to-orange-600', label: 'Naranja', preview: 'bg-gradient-to-r from-orange-500 to-orange-600' },
  { value: 'from-teal-500 to-teal-600', label: 'Verde azulado', preview: 'bg-gradient-to-r from-teal-500 to-teal-600' },
  { value: 'from-red-500 to-red-600', label: 'Rojo', preview: 'bg-gradient-to-r from-red-500 to-red-600' },
  { value: 'from-indigo-500 to-indigo-600', label: 'Índigo', preview: 'bg-gradient-to-r from-indigo-500 to-indigo-600' },
  { value: 'from-pink-500 to-pink-600', label: 'Rosa', preview: 'bg-gradient-to-r from-pink-500 to-pink-600' }
]

const ICON_OPTIONS = [
  'person-standing', 'building2', 'stethoscope', 'sailboat', 'building', 'plane',
  'car', 'home', 'heart', 'shield', 'users', 'briefcase', 'truck', 'hospital',
  'umbrella', 'plane-takeoff', 'map-pin', 'calendar', 'clock', 'dollar-sign'
]

const ProductForm = ({ product, isEditing = false }: ProductFormProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<ICategory[]>([])

  const [formData, setFormData] = useState({
    title: product?.title || '',
    subtitle: product?.subtitle || '',
    description: product?.description || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    period: product?.period || '/mes',
    features: product?.features || [''],
    icon: product?.icon || 'shield',
    color: product?.color || 'from-blue-500 to-blue-600',
    category: product?.category || '',
    popular: product?.popular || false,
    featured: product?.featured || false,
    active: product?.active ?? true,
    order: product?.order || 0,
    badge: product?.badge || '',
    discount: product?.discount || '',
    href: product?.href || '',
    image: product?.image || ''
  })

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?active=true')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setCategories(data.data)
            
            // Si es edición y el producto tiene categoría, obtener el ID como string
            if (isEditing && product?.category) {
              if (typeof product.category === 'object' && product.category._id) {
                setFormData(prev => ({ ...prev, category: product.category._id.toString() }))
              } else if (typeof product.category === 'string') {
                setFormData(prev => ({ ...prev, category: product.category?.toString() || '' }))
              }
            }
          }
        }
      } catch (error: unknown) {
        console.error('Error fetching categories:', error)
        setError('Error al cargar las categorías')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [isEditing, product?.category])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
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
    if (!formData.price.trim()) return 'El precio es obligatorio'
    if (!formData.category) return 'La categoría es obligatoria'
    if (formData.features.filter((f: string) => f.trim()).length === 0) return 'Debe tener al menos una característica'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Debug: Log de los datos que se van a enviar
    console.log('Datos del formulario antes de validación:', formData)
    
    const validationError = validateForm()
    if (validationError) {
      console.log('Error de validación:', validationError)
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Limpiar features vacías
      const cleanedData = {
        ...formData,
        features: formData.features.filter((feature: string) => feature.trim().length > 0)
      }
      
      // Debug: Log de los datos limpiados
      console.log('Datos limpios a enviar:', cleanedData)

      const url = isEditing ? `/api/products/${product?._id}` : '/api/products'
      const method = isEditing ? 'PUT' : 'POST'
      
      console.log('Enviando request a:', url, 'con método:', method)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      })
      
      console.log('Response status:', response.status)
      
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al guardar el producto')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      console.error('Error completo:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                  {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
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

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
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
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={(formData as any).subtitle}
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
                placeholder="Descripción del producto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Desde $30.000"
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
                  placeholder="$50.000"
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
                  placeholder="/mes"
                />
              </div>
            </div>
          </div>

          {/* Categoría y Configuración */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Categoría y Configuración</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={typeof formData.category === 'object' && formData.category?._id ? formData.category._id.toString() : formData.category?.toString() || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat._id.toString()} value={cat._id.toString()}>{cat.name}</option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleInputChange('color', color.value)}
                    className={`flex items-center p-3 border rounded-lg transition-all ${
                      formData.color === color.value 
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded ${color.preview} mr-2`}></div>
                    <span className="text-sm">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
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
                    checked={formData.popular}
                    onChange={(e) => handleInputChange('popular', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Popular</span>
                </label>
              </div>

              <div className="flex items-center space-x-6 pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Destacado</span>
                </label>
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

          {/* Características */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Características</h2>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
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

          {/* Campos Opcionales */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Imagen y Campos Opcionales</h2>
            
            {/* Subida de imagen */}
            <div className="mb-6">
              <ImageUploader
                value={formData.image}
                onChange={(url) => handleInputChange('image', url)}
                label="Imagen del Producto"
                maxSize={5}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge
                </label>
                <input
                  type="text"
                  value={(formData as any).badge}
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace Externo
                </label>
                <input
                  type="text"
                  value={(formData as any).href}
                  onChange={(e) => handleInputChange('href', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://ejemplo.com (opcional)"
                />
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
              {isEditing ? 'Actualizar' : 'Crear'} Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm
