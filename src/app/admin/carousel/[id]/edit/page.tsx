'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import CarouselForm from '@/components/admin/CarouselForm'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { ICarouselSlide } from '@/lib/models/CarouselSlide'

const EditCarouselSlidePage = () => {
  const params = useParams()
  const [slide, setSlide] = useState<ICarouselSlide | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (!slide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Slide no encontrado</div>
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

  return <CarouselForm slide={slide} isEditing={true} />
}

export default EditCarouselSlidePage
