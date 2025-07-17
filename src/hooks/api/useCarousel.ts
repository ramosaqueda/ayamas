import { useState, useEffect } from 'react'
import { ICarouselSlide } from '@/lib/models'

interface UseCarouselSlidesReturn {
  slides: ICarouselSlide[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCarouselSlides(activeOnly: boolean = true): UseCarouselSlidesReturn {
  const [slides, setSlides] = useState<ICarouselSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSlides = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (activeOnly !== undefined) params.append('active', activeOnly.toString())

      const response = await fetch(`/api/carousel?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar slides del carrusel')
      }

      setSlides(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setSlides([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [activeOnly])

  return {
    slides,
    loading,
    error,
    refetch: fetchSlides
  }
}

interface UseCarouselSlideReturn {
  slide: ICarouselSlide | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCarouselSlide(id: string): UseCarouselSlideReturn {
  const [slide, setSlide] = useState<ICarouselSlide | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSlide = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/carousel/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar slide')
      }

      setSlide(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setSlide(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlide()
  }, [id])

  return {
    slide,
    loading,
    error,
    refetch: fetchSlide
  }
}

// Hook para operaciones CRUD de slides del carrusel
export function useCarouselMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSlide = async (slideData: Partial<ICarouselSlide>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(slideData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear slide')
      }

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateSlide = async (id: string, slideData: Partial<ICarouselSlide>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/carousel/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(slideData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar slide')
      }

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteSlide = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/carousel/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar slide')
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const reorderSlides = async (slideIds: string[]) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/carousel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slideIds })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al reordenar slides')
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    createSlide,
    updateSlide,
    deleteSlide,
    reorderSlides,
    loading,
    error
  }
}
