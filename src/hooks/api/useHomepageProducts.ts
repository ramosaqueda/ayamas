'use client'

import { useState, useEffect } from 'react'
import { IProduct } from '@/lib/models/Product'

interface UseHomepageProductsOptions {
  maxProducts?: number
  showOnlyPopular?: boolean
  showOnlyActive?: boolean
}

interface UseHomepageProductsReturn {
  products: IProduct[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useHomepageProducts = ({
  maxProducts = 6,
  showOnlyPopular = false,
  showOnlyActive = true
}: UseHomepageProductsOptions = {}): UseHomepageProductsReturn => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Construir query params
      const params = new URLSearchParams()
      if (showOnlyActive) params.append('active', 'true')
      if (showOnlyPopular) params.append('popular', 'true')
      if (maxProducts) params.append('limit', maxProducts.toString())
      
      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }

      const data = await response.json()
      
      if (data.success) {
        let filteredProducts = data.data
        
        // Filtros adicionales en cliente si es necesario
        if (showOnlyPopular && !params.has('popular')) {
          filteredProducts = filteredProducts.filter((p: IProduct) => p.popular)
        }
        
        if (maxProducts && filteredProducts.length > maxProducts) {
          filteredProducts = filteredProducts.slice(0, maxProducts)
        }
        
        setProducts(filteredProducts)
      } else {
        throw new Error(data.message || 'Error al cargar productos')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error fetching homepage products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [maxProducts, showOnlyPopular, showOnlyActive])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
}

export default useHomepageProducts
