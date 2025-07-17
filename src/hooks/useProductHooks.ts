import { useState, useEffect } from 'react'
import { IProduct } from '@/lib/models/Product'
import { ICategory } from '@/lib/models/Category'

interface UseProductDetailReturn {
  product: IProduct | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProductDetail(productId: string): UseProductDetailReturn {
  const [product, setProduct] = useState<IProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products/${productId}`)
      const data = await response.json()

      if (data.success) {
        setProduct(data.data)
      } else {
        setError(data.message || 'Producto no encontrado')
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Error al cargar el producto')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  }
}

interface UseProductsReturn {
  products: IProduct[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/products')
      const data = await response.json()

      if (data.success) {
        setProducts(data.data)
      } else {
        setError(data.message || 'Error al cargar productos')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
}

interface UseProductFilterReturn {
  filteredProducts: IProduct[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: Array<{ value: string; label: string }>
}

// Función helper para obtener el slug de la categoría
const getCategorySlug = (category: any): string => {
  if (!category) return ''
  
  if (typeof category === 'object' && category.slug) {
    return category.slug
  }
  
  if (typeof category === 'string') {
    return category
  }
  
  return ''
}

// Función helper para obtener el nombre de la categoría
const getCategoryName = (category: any): string => {
  if (!category) return 'Sin categoría'
  
  if (typeof category === 'object' && category.name) {
    return category.name
  }
  
  if (typeof category === 'string') {
    // Fallback para categorías legacy
    const legacyCategories: { [key: string]: string } = {
      personal: 'Personales',
      empresarial: 'Empresariales',
      salud: 'Salud',
      especiales: 'Especiales',
      obligatorios: 'Obligatorios',
      condominios: 'Condominios'
    }
    return legacyCategories[category] || category
  }
  
  return 'Sin categoría'
}

export function useProductFilter(products: IProduct[]): UseProductFilterReturn {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([])

  const categories = [
    { value: 'todos', label: 'Todos los productos' },
    { value: 'personal', label: 'Personales' },
    { value: 'empresarial', label: 'Empresariales' },
    { value: 'salud', label: 'Salud' },
    { value: 'especiales', label: 'Especiales' },
    { value: 'obligatorios', label: 'Obligatorios' },
    { value: 'condominios', label: 'Condominios' }
  ]

  useEffect(() => {
    let filtered = products

    // Filtrar por categoría
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(product => {
        const categorySlug = getCategorySlug(product.category)
        return categorySlug === selectedCategory
      })
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(product => {
        const categoryName = getCategoryName(product.category)
        return product.title.toLowerCase().includes(searchLower) ||
               product.description.toLowerCase().includes(searchLower) ||
               categoryName.toLowerCase().includes(searchLower) ||
               product.features.some(feature => 
                 feature.toLowerCase().includes(searchLower)
               )
      })
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchTerm])

  return {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories
  }
}

// Exportar las funciones helper para usar en otros componentes
export { getCategorySlug, getCategoryName }
