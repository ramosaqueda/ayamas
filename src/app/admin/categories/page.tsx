'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUpDown } from 'lucide-react'
import { ICategory } from '@/lib/models/Category'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import ConfirmDelete from '@/components/admin/ConfirmDelete'

const CategoriesPage = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; category: ICategory | null }>({
    isOpen: false,
    category: null
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      
      if (!response.ok) {
        throw new Error('Error al cargar categorías')
      }

      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      } else {
        throw new Error(data.message || 'Error al cargar categorías')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.category) return

    try {
      const response = await fetch(`/api/categories/${deleteModal.category._id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar categoría')
      }

      // Actualizar lista
      setCategories(categories.filter(cat => cat._id !== deleteModal.category!._id))
      setDeleteModal({ isOpen: false, category: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const toggleActive = async (category: ICategory) => {
    try {
      const response = await fetch(`/api/categories/${category._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...category,
          active: !category.active
        })
      })

      if (!response.ok) {
        throw new Error('Error al actualizar categoría')
      }

      const data = await response.json()
      
      if (data.success) {
        setCategories(categories.map(cat => 
          cat._id === category._id ? { ...cat, active: !cat.active } : cat
        ))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar')
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
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
              <h1 className="text-xl font-semibold text-gray-900">
                Gestión de Categorías
              </h1>
              <div className="ml-4 text-sm text-gray-500">
                {categories.length} categorías
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/categories/new')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabla de categorías */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Nombre</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Orden</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creada
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {category.order}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(category)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          category.active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {category.active ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Activa
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactiva
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/admin/categories/${category._id}/edit`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, category })}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No hay categorías registradas
              </div>
              <button
                onClick={() => router.push('/admin/categories/new')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Categoría
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, category: null })}
        onConfirm={handleDelete}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${deleteModal.category?.name}"? Esta acción no se puede deshacer y puede afectar productos asociados.`}
      />
    </div>
  )
}

export default CategoriesPage
