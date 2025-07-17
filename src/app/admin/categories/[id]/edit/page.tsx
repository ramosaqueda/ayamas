'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import CategoryForm from '@/components/admin/CategoryForm'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { ICategory } from '@/lib/models/Category'

const EditCategoryPage = () => {
  const params = useParams()
  const [category, setCategory] = useState<ICategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Error al cargar la categoría')
        }

        const data = await response.json()
        
        if (data.success) {
          setCategory(data.data)
        } else {
          throw new Error(data.message || 'Error al cargar la categoría')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching category:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCategory()
    }
  }, [params.id])

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
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Categoría no encontrada</div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  return <CategoryForm category={category} isEditing={true} />
}

export default EditCategoryPage
