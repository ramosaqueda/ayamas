'use client'

import { useRouter } from 'next/navigation'
import { IProduct } from '@/lib/models/Product'
import ProductCard from '@/components/ui/ProductCard'
import Loading from '@/components/ui/Loading'

interface ProductsGridProps {
  products: IProduct[]
  loading?: boolean
  error?: string | null
  variant?: 'default' | 'compact' | 'homepage'
  showFeatures?: boolean
  maxFeatures?: number
  maxProducts?: number
  showOnlyPopular?: boolean
  className?: string
}

const ProductsGrid = ({
  products,
  loading = false,
  error = null,
  variant = 'default',
  showFeatures = true,
  maxFeatures = 4,
  maxProducts,
  showOnlyPopular = false,
  className = ''
}: ProductsGridProps) => {
  const router = useRouter()

  const handleProductClick = (productId: string) => {
    router.push(`/productos/${productId}`)
  }

  // Filtrar productos si es necesario
  let filteredProducts = products
  
  if (showOnlyPopular) {
    filteredProducts = products.filter(product => product.popular)
  }
  
  if (maxProducts) {
    filteredProducts = filteredProducts.slice(0, maxProducts)
  }

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loading size="lg" variant="spinner" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold mb-2">Error al cargar productos</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  // No products state
  if (filteredProducts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <h3 className="text-xl font-semibold text-neutral-600 mb-2">
          No se encontraron productos
        </h3>
        <p className="text-neutral-500">
          {showOnlyPopular 
            ? 'No hay productos populares disponibles en este momento.'
            : 'No hay productos disponibles en este momento.'
          }
        </p>
      </div>
    )
  }

  // Grid layout based on variant
  const getGridClasses = () => {
    switch (variant) {
      case 'compact':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      case 'homepage':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
    }
  }

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {filteredProducts.map((product) => (
        <ProductCard
          key={product._id.toString()}
          product={product}
          onClick={handleProductClick}
          variant={variant}
          showFeatures={showFeatures}
          maxFeatures={maxFeatures}
        />
      ))}
    </div>
  )
}

export default ProductsGrid
