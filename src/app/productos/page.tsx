'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import ProductCard from '@/components/ui/ProductCard'
import { Filter, Search } from 'lucide-react'
import { useProducts, useProductFilter } from '@/hooks/useProductHooks'

export default function ProductsPage() {
  const router = useRouter()
  const { products, loading, error } = useProducts()
  const {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories
  } = useProductFilter(products)

  const handleProductClick = (productId: string) => {
    router.push(`/productos/${productId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" variant="spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">{error}</h1>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neutral-800 mb-4">
              Nuestros Productos de Seguros
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Descubre nuestra amplia gama de seguros diseñados para proteger lo que más te importa
            </p>
          </div>

          {/* Filtros y búsqueda */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de categorías */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-neutral-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-48"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-neutral-600 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-neutral-500">
              Intenta ajustar los filtros o términos de búsqueda
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-neutral-600">
                Mostrando {filteredProducts.length} de {products.length} productos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id.toString()}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿No encuentras el seguro que necesitas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestros expertos pueden ayudarte a encontrar la solución perfecta
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push('/contacto')}
            className="font-semibold"
          >
            Contactar un asesor
          </Button>
        </div>
      </div>
    </div>
  )
}
