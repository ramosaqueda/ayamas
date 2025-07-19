'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Eye, Upload, X, Calendar, Clock, Star, Tag } from 'lucide-react'
import { INews } from '@/lib/models/News'
import ImageUploader from './ImageUploader'

interface NewsFormProps {
  news?: INews | null
  isEditing?: boolean
}

const categories = [
  { value: 'regulaciones', label: 'Regulaciones' },
  { value: 'consejos', label: 'Consejos' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'general', label: 'General' }
]

const NewsForm: React.FC<NewsFormProps> = ({ news, isEditing = false }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    content: '',
    image: '',
    author: '',
    category: 'general' as 'regulaciones' | 'consejos' | 'tecnologia' | 'empresa' | 'general',
    readTime: '5 min',
    featured: false,
    active: true,
    published: false,
    publishedAt: '',
    slug: '',
    tags: [] as string[],
    href: '',
    seoTitle: '',
    seoDescription: ''
  })

  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        subtitle: (news as any).subtitle || '',
        description: news.description || '',
        content: news.content || '',
        image: news.image || '',
        author: news.author || '',
        category: news.category || 'general',
        readTime: news.readTime || '5 min',
        featured: news.featured || false,
        active: news.active !== undefined ? news.active : true,
        published: news.published || false,
        publishedAt: news.publishedAt ? new Date(news.publishedAt).toISOString().split('T')[0] : '',
        slug: news.slug || '',
        tags: news.tags || [],
        href: (news as any).href || '',
        seoTitle: news.seoTitle || '',
        seoDescription: news.seoDescription || ''
      })
    }
  }, [news])

  // Auto-generar slug basado en el título
  useEffect(() => {
    if (formData.title && !isEditing) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, isEditing])

  // Auto-generar SEO si no existe
  useEffect(() => {
    if (formData.title && !formData.seoTitle) {
      setFormData(prev => ({ ...prev, seoTitle: formData.title.slice(0, 60) }))
    }
  }, [formData.title])

  useEffect(() => {
    if (formData.description && !formData.seoDescription) {
      setFormData(prev => ({ ...prev, seoDescription: formData.description.slice(0, 160) }))
    }
  }, [formData.description])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const url = isEditing ? `/api/news/${news?._id}` : '/api/news'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.publishedAt ? new Date(formData.publishedAt) : undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar la noticia')
      }

      setSuccess(isEditing ? 'Noticia actualizada exitosamente' : 'Noticia creada exitosamente')
      
      setTimeout(() => {
        router.push('/admin/news')
      }, 1500)

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
                onClick={() => router.push('/admin/news')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {isEditing ? 'Editar Noticia' : 'Nueva Noticia'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {isEditing ? 'Modifica los datos de la noticia' : 'Completa la información de la nueva noticia'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Noticia')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      maxLength={200}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Escribe el título de la noticia..."
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      maxLength={500}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción breve de la noticia..."
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                      Contenido
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contenido completo de la noticia..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Imagen Principal</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sube una imagen para la noticia o deja vacío para usar la imagen por defecto.
                </p>
                <ImageUploader
                  value={formData.image}
                  onChange={handleImageUpload}
                  label="Imagen de la noticia (opcional)"
                  accept="image/*"
                  maxSize={5}
                />
                {!formData.image && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      📝 Si no subes una imagen, se usará una imagen por defecto automáticamente.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                      Autor *
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      maxLength={100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre del autor..."
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                      Slug (URL) *
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="url-de-la-noticia"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      URL final: /noticias/{formData.slug}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Tiempo de lectura
                    </label>
                    <input
                      type="text"
                      id="readTime"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5 min"
                    />
                  </div>

                  <div>
                    <label htmlFor="href" className="block text-sm font-medium text-gray-700 mb-1">
                      URL externa (opcional)
                    </label>
                    <input
                      type="url"
                      id="href"
                      name="href"
                      value={(formData as any).href}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estados</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                      Activo
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                      Publicado
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        Destacado
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Etiquetas</h3>
                
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nueva etiqueta..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewsForm
