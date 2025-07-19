'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Calendar, Tag, DollarSign, List } from 'lucide-react'
import { IProduct } from '@/lib/models/Product'
import { ICategory } from '@/lib/models/Category'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import { getIcon } from '@/lib/iconUtils'

const ProductDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<IProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Error al cargar el producto')
        }

        const data = await response.json()
        
        if (data.success) {
          setProduct(data.data)
        } else {
          throw new Error(data.message || 'Error al cargar el producto')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (!product) return

    try {
      const response = await fetch(`/api/products/${product._id.toString()}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar producto')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const getCategoryLabel = (category: any): string => {
    // Si es null o undefined
    if (!category) {
      return 'Sin categoría'
    }
    
    // Si es un objeto con propiedad name (ICategory o PopulatedDoc)
    if (typeof category === 'object' && category?.name) {
      return category.name
    }
    
    // Si es un ObjectId, convertir a string y buscar en legacy
    const categoryStr = category.toString ? category.toString() : String(category)
    
    // Fallback para categorías legacy
    const legacyCategories: { [key: string]: string } = {
      personal: 'Personal',
      empresarial: 'Empresarial', 
      salud: 'Salud',
      especiales: 'Especiales',
      obligatorios: 'Obligatorios',
      condominios: 'Condominios'
    }
    
    return legacyCategories[categoryStr] || categoryStr || 'Sin categoría'
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Productos
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Producto no encontrado</div>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Productos
          </button>
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
                onClick={() => router.push('/admin/products')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver a Productos
              </button>
              <div className="ml-4 border-l border-gray-300 pl-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  {product.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {getCategoryLabel(product.category)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/admin/products/${product._id.toString()}/edit`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </button>
              <button
                onClick={() => setDeleteModal(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-r ${product.color} flex items-center justify-center`}>
                  {getIcon(product.icon, "w-8 h-8 text-white")}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h2>
                  {(product as any).subtitle && (
                    <h3 className="text-lg text-gray-600 mb-3">
                      {(product as any).subtitle}
                    </h3>
                  )}
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Precio y Detalles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Información de Precio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Precio Actual
                  </label>
                  <div className="text-2xl font-bold text-green-600">
                    {product.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.period}
                  </div>
                </div>
                {product.originalPrice && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Precio Original
                    </label>
                    <div className="text-lg font-medium text-gray-500 line-through">
                      {product.originalPrice}
                    </div>
                  </div>
                )}
                {product.discount && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Descuento
                    </label>
                    <div className="text-lg font-bold text-red-600">
                      {product.discount}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Características */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <List className="w-5 h-5 mr-2" />
                Características
              </h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enlaces e Imagen */}
            {((product as any).href || product.image) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recursos Adicionales
                </h3>
                <div className="space-y-4">
                  {(product as any).href && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Enlace
                      </label>
                      <a 
                        href={(product as any).href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {(product as any).href}
                      </a>
                    </div>
                  )}
                  {product.image && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Imagen
                      </label>
                      <div className="mt-2">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="max-w-xs rounded-lg shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        <p className="text-sm text-gray-500 mt-1 break-all">
                          {product.image}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Estado y Configuración */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Estado y Configuración
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Categoría</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getCategoryLabel(product.category)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Estado</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.active ? (
                      <><Eye className="w-3 h-3 mr-1" /> Activo</>
                    ) : (
                      <><EyeOff className="w-3 h-3 mr-1" /> Inactivo</>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Popular</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.popular 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.popular ? 'Sí' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Destacado</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.featured 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.featured ? 'Sí' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Orden</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {product.order}
                  </span>
                </div>
                
                {(product as any).badge && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Badge</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {(product as any).badge}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadatos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Información del Sistema
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    ID del Producto
                  </label>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">
                    {product._id.toString()}
                  </code>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Fecha de Creación
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(product.createdAt)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Última Actualización
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(product.updatedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Vista Previa */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vista Previa
              </h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${product.color} text-white`}>
                    {getIcon(product.icon, "w-6 h-6")}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {product.price}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.period}
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1">
                  {product.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {product.description}
                </p>
                
                <div className="text-xs text-gray-500">
                  {product.features.length} características incluidas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmDelete
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${product.title}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}

export default ProductDetailPage
