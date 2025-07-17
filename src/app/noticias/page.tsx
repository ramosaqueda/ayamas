'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, User, Clock, Star, ChevronRight, Search, Filter } from 'lucide-react'
import { INews } from '@/lib/models/News'

interface NewsResponse {
  success: boolean
  data: INews[]
  count: number
}

const categories = [
  { value: '', label: 'Todas las categorías' },
  { value: 'regulaciones', label: 'Regulaciones' },
  { value: 'consejos', label: 'Consejos' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'general', label: 'General' }
]

const NewsPage = () => {
  const router = useRouter()
  const [news, setNews] = useState<INews[]>([])
  const [featuredNews, setFeaturedNews] = useState<INews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    featured: false
  })

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('published', 'true')
      params.append('active', 'true')
      
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      if (filters.featured) params.append('featured', 'true')

      const response = await fetch(`/api/news?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar noticias')
      }

      const data: NewsResponse = await response.json()
      
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

  const fetchFeaturedNews = async () => {
    try {
      const response = await fetch('/api/news?featured=true&published=true&active=true&limit=3')
      
      if (response.ok) {
        const data: NewsResponse = await response.json()
        if (data.success) {
          setFeaturedNews(data.data)
        }
      }
    } catch (err) {
      console.error('Error fetching featured news:', err)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [filters.category, filters.featured])

  useEffect(() => {
    fetchFeaturedNews()
  }, [])

  // Filtro de búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchNews()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [filters.search])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

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

  const handleNewsClick = (newsItem: INews) => {
    if (newsItem.href) {
      window.open(newsItem.href, '_blank')
    } else {
      router.push(`/noticias/${newsItem.slug}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Noticias y Artículos
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Mantente informado con las últimas noticias del sector de seguros, 
              consejos útiles y actualizaciones regulatorias
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Noticias Destacadas */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Noticias Destacadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredNews.map((newsItem) => (
                <div
                  key={newsItem._id}
                  onClick={() => handleNewsClick(newsItem)}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(newsItem.category)}`}>
                        {getCategoryLabel(newsItem.category)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Destacado
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {newsItem.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {newsItem.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {newsItem.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {newsItem.readTime}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(newsItem.publishedAt || newsItem.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categoría */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Solo destacadas */}
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                />
                <span className="text-sm text-gray-700">Solo destacadas</span>
              </label>
            </div>
          </div>
        </div>

        {/* Lista de Noticias */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {filters.category ? `${getCategoryLabel(filters.category)}` : 'Todas las Noticias'}
            </h2>
            <div className="text-sm text-gray-500">
              {news.length} {news.length === 1 ? 'noticia' : 'noticias'} encontradas
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No se encontraron noticias</div>
              <div className="text-gray-400 text-sm">
                Intenta ajustar los filtros de búsqueda
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((newsItem) => (
                <article
                  key={newsItem._id}
                  onClick={() => handleNewsClick(newsItem)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
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
                    {newsItem.subtitle && (
                      <p className="text-gray-600 text-sm mb-2">
                        {newsItem.subtitle}
                      </p>
                    )}
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
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewsPage
