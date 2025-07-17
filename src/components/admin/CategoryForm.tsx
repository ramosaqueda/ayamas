'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { ICategory } from '@/lib/models/Category'

interface CategoryFormProps {
  category?: Partial<ICategory>
  isEditing?: boolean
}

const CategoryForm = ({ category, isEditing = false }: CategoryFormProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    order: category?.order || 0,
    active: category?.active ?? true
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generar slug cuando se cambia el nombre
    if (field === 'name' && !isEditing) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug: autoSlug }))
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) return 'El nombre es obligatorio'
    if (!formData.slug.trim()) return 'El slug es obligatorio'
    if (!/^[a-z0-9-]+$/.test(formData.slug)) return 'El slug solo puede contener letras minúsculas, números y guiones'
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
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim()
      }

      const url = isEditing ? `/api/categories/${category?._id}` : '/api/categories'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al guardar la categoría')
      }

      router.push('/admin/categories')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
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
                  {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre de la categoría"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="slug-de-la-categoria"
                  pattern="^[a-z0-9-]+$"
                  title="Solo letras minúsculas, números y guiones"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Solo letras minúsculas, números y guiones. Se usa en las URLs.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción opcional de la categoría"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                  placeholder="0"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Número para ordenar las categorías. Menor número = mayor prioridad.
                </p>
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Categoría activa</span>
                </label>
              </div>
            </div>
          </div>

          {/* Vista previa */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Vista Previa</h2>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.name || 'Nombre de la categoría'}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {formData.active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {formData.description || 'Sin descripción'}
              </p>
              <div className="text-xs text-gray-500">
                Slug: <code className="bg-white px-1 py-0.5 rounded">
                  {formData.slug || 'slug-de-la-categoria'}
                </code>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
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
              {isEditing ? 'Actualizar' : 'Crear'} Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryForm
