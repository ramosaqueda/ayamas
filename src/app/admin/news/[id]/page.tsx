'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Edit, Eye, Calendar, User, Clock, Star, Tag } from 'lucide-react'
import { INews } from '@/lib/models/News'
import LoadingSpinner from '@/components/admin/LoadingSpinner'

const NewsDetailPage = () => {
  const router = useRouter()
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

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      regulaciones: 'bg-red-100 text-red-800',
      consejos: 'bg-green-100 text-green-800',
      tecnologia: 'bg-blue-100 text-blue-800',
      empresa: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryLabel = (category: string): string => {
    const labels: { [key: string]: string } = {
      regulaciones: 'Regulaciones',
      consejos: 'Consejos',
      tecnologia: 'Tecnología',
      empresa: 'Empresa',
      general: 'General'
    }
    return labels[category] || category
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePreview = () => {
    if (news?.published) {
      window.open(`/noticias/${news.slug}`, '_blank')
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/news')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Noticias
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Detalle de Noticia</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Vista completa de la noticia
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {news.published && (
                <button
                  onClick={handlePreview}
                  className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver en Sitio
                </button>
              )}
              <button
                onClick={() => router.push(`/admin/news/${news._id.toString()}/edit`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header de la noticia */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                      {getCategoryLabel(news.category)}
                    </span>
                    {news.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Destacado
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      news.published && news.active 
                        ? 'bg-green-100 text-green-800' 
                        : news.published 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {news.published && news.active ? 'Publicado' : news.published ? 'Inactivo' : 'Borrador'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{news.title}</h1>
                  {(news as any).subtitle && (
                    <p className="text-xl text-gray-600 mb-4">{(news as any).subtitle}</p>
                  )}
                  <p className="text-gray-700 text-lg leading-relaxed">{news.description}</p>
                </div>
              </div>

              {/* Meta información */}
              <div className="flex items-center space-x-6 text-sm text-gray-500 border-t pt-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {news.author}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {news.readTime}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(news.publishedAt || news.createdAt)}
                </div>
              </div>
            </div>

            {/* Imagen */}
            {news.image && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Imagen Principal</h3>
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}

            {/* Contenido */}
            {news.content && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contenido</h3>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {news.content}
                  </div>
                </div>
              </div>
            )}

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título SEO
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                    {news.seoTitle || news.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción SEO
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                    {news.seoDescription || news.description}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <p className="text-blue-600 bg-gray-50 p-3 rounded border font-mono text-sm">
                    {(news as any).href || `/noticias/${news.slug}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span className={`text-sm font-medium ${
                    news.published && news.active 
                      ? 'text-green-600' 
                      : news.published 
                      ? 'text-yellow-600' 
                      : 'text-gray-600'
                  }`}>
                    {news.published && news.active ? 'Publicado' : news.published ? 'Inactivo' : 'Borrador'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Creado:</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(news.createdAt)}
                  </span>
                </div>
                {news.publishedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Publicado:</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(news.publishedAt)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Actualizado:</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(news.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Etiquetas */}
            {news.tags && news.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Configuración */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Categoría:</span>
                  <span className="text-sm text-gray-900">
                    {getCategoryLabel(news.category)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Autor:</span>
                  <span className="text-sm text-gray-900">{news.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tiempo de lectura:</span>
                  <span className="text-sm text-gray-900">{news.readTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Slug:</span>
                  <span className="text-sm text-gray-900 font-mono">{news.slug}</span>
                </div>
                {(news as any).href && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">URL externa:</span>
                    <a 
                      href={(news as any).href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-32"
                    >
                      {(news as any).href}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsDetailPage
