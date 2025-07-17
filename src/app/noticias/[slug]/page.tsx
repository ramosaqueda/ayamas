'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, User, Clock, Star, ArrowLeft, Share2, Tag, ChevronRight } from 'lucide-react'
import { INews } from '@/lib/models/News'

const NewsDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<INews | null>(null)
  const [relatedNews, setRelatedNews] = useState<INews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const slug = params.slug as string

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('Fetching news for slug:', slug)

        // Buscar por slug usando la nueva API
        const response = await fetch(`/api/news/slug/${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Noticia no encontrada')
          }
          throw new Error('Error al cargar la noticia')
        }

        const data = await response.json()
        
        console.log('News data received:', data)
        
        if (data.success && data.data) {
          setNews(data.data)
          // Cargar noticias relacionadas
          fetchRelatedNews(data.data.category, data.data._id)
        } else {
          throw new Error('Noticia no encontrada')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching news:', err)
      } finally {
        setLoading(false)
      }
    }

    const fetchRelatedNews = async (category: string, currentId: string) => {
      try {
        const response = await fetch(`/api/news?category=${category}&published=true&active=true&limit=3`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // Filtrar la noticia actual
            const related = data.data.filter((n: INews) => n._id !== currentId)
            setRelatedNews(related.slice(0, 3))
          }
        }
      } catch (err) {
        console.error('Error fetching related news:', err)
      }
    }

    if (slug) {
      fetchNews()
    }
  }, [slug])

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
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.description,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('URL copiada al portapapeles')
    }
  }

  const handleRelatedNewsClick = (newsItem: INews) => {
    if (newsItem.href) {
      window.open(newsItem.href, '_blank')
    } else {
      router.push(`/noticias/${newsItem.slug}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Noticia no encontrada</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => router.push('/noticias')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Noticias
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <button
              onClick={() => router.push('/')}
              className="hover:text-gray-700 transition-colors"
            >
              Inicio
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => router.push('/noticias')}
              className="hover:text-gray-700 transition-colors"
            >
              Noticias
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate">{news.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(news.category)}`}>
              {getCategoryLabel(news.category)}
            </span>
            {news.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                Destacado
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {news.title}
          </h1>
          
          {news.subtitle && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {news.subtitle}
            </p>
          )}
          
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {news.description}
          </p>

          {/* Meta información */}
          <div className="flex items-center justify-between border-t border-b py-4">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium">{news.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(news.publishedAt || news.createdAt)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {news.readTime}
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </button>
          </div>
        </header>

        {/* Imagen principal */}
        {news.image && (
          <div className="mb-8">
            <img 
              src={news.image} 
              alt={news.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Contenido */}
        {news.content && (
          <div className="prose prose-lg max-w-none mb-12">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {news.content}
            </div>
          </div>
        )}

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botón de acción */}
        <div className="text-center mb-12">
          <button
            onClick={() => router.push('/noticias')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Noticias
          </button>
        </div>
      </article>

      {/* Noticias relacionadas */}
      {relatedNews.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Noticias Relacionadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedNews.map((newsItem) => (
                <article
                  key={newsItem._id}
                  onClick={() => handleRelatedNewsClick(newsItem)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group border"
                >
                  <div className="relative">
                    {newsItem.image && (
                      <img 
                        src={newsItem.image} 
                        alt={newsItem.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(newsItem.category)}`}>
                        {getCategoryLabel(newsItem.category)}
                      </span>
                    </div>
                    {newsItem.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Destacado
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {newsItem.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {newsItem.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {newsItem.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {newsItem.readTime}
                        </div>
                      </div>
                      <div className="flex items-center group-hover:text-blue-600 transition-colors">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(newsItem.publishedAt || newsItem.createdAt)}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default NewsDetailPage
