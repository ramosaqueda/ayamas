'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Filter, Search, MoreHorizontal, Calendar, User, Clock, Star } from 'lucide-react'
import { INews } from '@/lib/models/News'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import LoadingSpinner from '@/components/admin/LoadingSpinner'

interface NewsResponse {
  success: boolean
  data: INews[]
  count: number
}

const categories = [
  { value: 'regulaciones', label: 'Regulaciones' },
  { value: 'consejos', label: 'Consejos' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'general', label: 'General' }
]

const NewsPage = () => {
  const router = useRouter()
  const [news, setNews] = useState<INews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; news: INews | null }>({
    show: false,
    news: null
  })

  // Filtros y búsqueda
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    published: '',
    featured: '',
    active: ''
  })

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('admin', 'true') // Indicar que es para admin
      
      if (filters.category) params.append('category', filters.category)
      if (filters.published) params.append('published', filters.published)
      if (filters.featured) params.append('featured', filters.featured)
      if (filters.active) params.append('active', filters.active)
      if (filters.search) params.append('search', filters.search)

      console.log('Admin fetching news with params:', params.toString())

      const response = await fetch(`/api/news?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar noticias')
      }

      const data: NewsResponse = await response.json()
      
      console.log('Admin news response:', data)
      
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

  useEffect(() => {
    fetchNews()
  }, [filters.category, filters.published, filters.featured, filters.active])

  // Filtro de búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchNews()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [filters.search])

  const handleDelete = async (newsItem: INews) => {
    try {
      const response = await fetch(`/api/news/${newsItem._id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar noticia')
      }

      setNews(news.filter(n => n._id !== newsItem._id))
      setDeleteModal({ show: false, news: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getCategoryLabel = (category: string): string => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.label : category
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

  const getStatusBadge = (newsItem: INews) => {
    const badges = []
    
    if (!newsItem.active) badges.push({ text: 'Inactivo', class: 'bg-gray-100 text-gray-800' })
    if (!newsItem.published) badges.push({ text: 'Borrador', class: 'bg-yellow-100 text-yellow-800' })
    if (newsItem.featured) badges.push({ text: 'Destacado', class: 'bg-blue-100 text-blue-800' })
    if (newsItem.published && newsItem.active) badges.push({ text: 'Publicado', class: 'bg-green-100 text-green-800' })
    
    return badges
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading && news.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
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
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Noticias</h1>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona las noticias y artículos del blog
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/news/new')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Noticia
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categoría */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <select
                value={filters.published}
                onChange={(e) => handleFilterChange('published', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="true">Publicado</option>
                <option value="false">Borrador</option>
              </select>
            </div>

            {/* Destacado */}
            <div>
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Destacados</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-900">{news.length}</div>
            <div className="text-sm text-gray-600">Total noticias</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">
              {news.filter(n => n.published && n.active).length}
            </div>
            <div className="text-sm text-gray-600">Publicadas</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">
              {news.filter(n => n.featured).length}
            </div>
            <div className="text-sm text-gray-600">Destacadas</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {news.filter(n => !n.published).length}
            </div>
            <div className="text-sm text-gray-600">Borradores</div>
          </div>
        </div>

        {/* Tabla de Noticias */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Noticia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((newsItem) => (
                  <tr key={newsItem._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-200">
                          {newsItem.image ? (
                            <img 
                              src={newsItem.image} 
                              alt={newsItem.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">Sin imagen</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {newsItem.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {newsItem.description}
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {newsItem.readTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(newsItem.category)}`}>
                        {getCategoryLabel(newsItem.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {newsItem.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {getStatusBadge(newsItem).map((badge, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.class}`}
                          >
                            {badge.text}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div>{formatDate(newsItem.publishedAt || newsItem.createdAt)}</div>
                          {newsItem.publishedAt && (
                            <div className="text-xs text-gray-500">Publicado</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/admin/news/${newsItem._id}`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Ver noticia"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/news/${newsItem._id}/edit`)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="Editar noticia"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, news: newsItem })}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar noticia"
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

          {/* Estado vacío */}
          {news.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No se encontraron noticias</div>
              <div className="text-gray-400 text-sm mb-4">
                {filters.search || filters.category || filters.published || filters.featured
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primera noticia'}
              </div>
              {!filters.search && !filters.category && !filters.published && !filters.featured && (
                <button
                  onClick={() => router.push('/admin/news/new')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Noticia
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmDelete
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, news: null })}
        onConfirm={() => deleteModal.news && handleDelete(deleteModal.news)}
        title="Eliminar Noticia"
        message={`¿Estás seguro de que deseas eliminar la noticia "${deleteModal.news?.title}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}

export default NewsPage
