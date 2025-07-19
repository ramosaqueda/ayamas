'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { INews } from '@/lib/models/News'
import NewsForm from '@/components/admin/NewsForm'
import LoadingSpinner from '@/components/admin/LoadingSpinner'

const EditNewsPage = () => {
  const params = useParams()
  const [news, setNews] = useState<INews | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const newsId = params.id?.toString() || ''

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/news/${newsId}`)
        
        if (!response.ok) {
          throw new Error('Error al cargar la noticia')
        }

        const data = await response.json()
        
        if (data.success) {
          setNews(data.data)
        } else {
          throw new Error('Error en la respuesta del servidor')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching news:', err)
      } finally {
        setLoading(false)
      }
    }

    if (newsId) {
      fetchNews()
    }
  }, [newsId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Noticia no encontrada'}
          </div>
        </div>
      </div>
    )
  }

  return <NewsForm news={news} isEditing={true} />
}

export default EditNewsPage
