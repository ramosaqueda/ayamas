'use client'

import { useRouter } from 'next/navigation'
import ProductCard from '@/components/ui/ProductCard'
import { IProduct } from '@/lib/models/Product'
import { getCategoryName, getCategorySlug } from '@/hooks/useProductHooks'

interface RelatedProductsProps {
  currentProduct: IProduct
  allProducts: IProduct[]
  maxProducts?: number
}

export default function RelatedProducts({ 
  currentProduct, 
  allProducts, 
  maxProducts = 3 
}: RelatedProductsProps) {
  const router = useRouter()

  // Filtrar productos relacionados
  const relatedProducts = allProducts
    .filter(product => {
      const currentCategorySlug = getCategorySlug(currentProduct.category)
      const productCategorySlug = getCategorySlug(product.category)
      
      return product._id.toString() !== currentProduct._id.toString() && // Excluir el producto actual
        product.active && // Solo productos activos
        (
          productCategorySlug === currentCategorySlug || // Misma categoría
          product.features.some(feature => 
            currentProduct.features.some(currentFeature => 
              feature.toLowerCase().includes(currentFeature.toLowerCase()) ||
              currentFeature.toLowerCase().includes(feature.toLowerCase())
            )
          ) // Características similares
        )
    })
    .slice(0, maxProducts)

  const handleProductClick = (productId: string) => {
    router.push(`/productos/${productId}`)
  }

  if (relatedProducts.length === 0) {
    return null
  }

  const currentCategorySlug = getCategorySlug(currentProduct.category)
  const currentCategoryName = getCategoryName(currentProduct.category)
  const sameCategoryProducts = allProducts.filter(p => 
    getCategorySlug(p.category) === currentCategorySlug && 
    p._id.toString() !== currentProduct._id.toString()
  )

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Productos Relacionados
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Descubre otros productos que podrían interesarte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product._id.toString()}
              product={product}
              onClick={handleProductClick}
              className="animate-fade-in-up"
            />
          ))}
        </div>

        {sameCategoryProducts.length > maxProducts && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push(`/productos?categoria=${currentCategorySlug}`)}
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              Ver todos los productos de {currentCategoryName}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
