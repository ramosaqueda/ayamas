import { useState, useEffect } from 'react'
import { IProduct } from '@/lib/models'

interface UseProductsOptions {
  category?: string
  featured?: boolean
  popular?: boolean
  active?: boolean
}

interface UseProductsReturn {
  products: IProduct[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (options.category) params.append('category', options.category)
      if (options.featured !== undefined) params.append('featured', options.featured.toString())
      if (options.popular !== undefined) params.append('popular', options.popular.toString())
      if (options.active !== undefined) params.append('active', options.active.toString())

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar productos')
      }

      setProducts(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [options.category, options.featured, options.popular, options.active])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
}

interface UseProductReturn {
  product: IProduct | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProduct(id: string): UseProductReturn {
  const [product, setProduct] = useState<IProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar producto')
      }

      setProduct(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  }
}

// Hook para operaciones CRUD de productos
export function useProductMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProduct = async (productData: Partial<IProduct>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear producto')
      }

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, productData: Partial<IProduct>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar producto')
      }

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar producto')
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error
  }
}
