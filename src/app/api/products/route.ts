import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'
import mongoose from 'mongoose'

// GET - Obtener todos los productos con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const active = searchParams.get('active')
    const featured = searchParams.get('featured')
    const popular = searchParams.get('popular')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')

    // Construir filtros
    const filters: any = {}
    if (category) {
      // Buscar categoría por slug o ID
      let categoryObj
      if (mongoose.Types.ObjectId.isValid(category?.toString())) {
        categoryObj = await Category.findById(category)
      } else {
        categoryObj = await Category.findOne({ slug: category })
      }
      
      if (categoryObj) {
        filters.category = categoryObj._id
      } else {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: { total: 0, page: 1, limit: 20, pages: 0 }
        })
      }
    }
    
    if (active !== null) filters.active = active === 'true'
    if (featured !== null) filters.featured = featured === 'true'
    if (popular !== null) filters.popular = popular === 'true'

    // Configurar paginación
    const pageNumber = parseInt(page || '1')
    const limitNumber = parseInt(limit || '20')
    const skip = (pageNumber - 1) * limitNumber

    // Obtener productos - primero sin populate para evitar errores
    const products = await Product.find(filters)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean()

    // Intentar poblar las categorías de forma segura
    const productsWithCategories = []
    
    for (const product of products) {
      try {
        // Verificar si la categoría ya está poblada o es un ObjectId
        if (product.category && typeof product.category === 'object' && 'name' in product.category) {
          // La categoría ya está poblada
          productsWithCategories.push(product)
        } else if (product.category && mongoose.Types.ObjectId.isValid(product.category.toString())) {
          // La categoría es un ObjectId, necesita populate
          const populatedProduct = await Product.findById(product._id).populate('category').lean()
          productsWithCategories.push(populatedProduct)
        } else {
          // Si es string u otro tipo, buscar la categoría manualmente
          const categorySlug = product.category?.toString() || ''
          const categoryData = await Category.findOne({ slug: categorySlug }).lean()
          
          productsWithCategories.push({
            ...product,
            category: categoryData || { 
              _id: null, 
              name: categorySlug, 
              slug: categorySlug, 
              active: true 
            }
          })
        }
      } catch (error: unknown) {
        console.error(`Error poblando categoría para producto ${product._id}:`, error)
        // Agregar producto sin categoría poblada
        productsWithCategories.push({
          ...product,
          category: { 
            _id: null, 
            name: product.category?.toString() || 'Sin categoría', 
            slug: product.category?.toString() || 'sin-categoria', 
            active: true 
          }
        })
      }
    }

    // Obtener total para paginación
    const total = await Product.countDocuments(filters)

    return NextResponse.json({
      success: true,
      data: productsWithCategories,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      }
    })
  } catch (error: unknown) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validar datos requeridos
    const requiredFields = ['title', 'description', 'price', 'category', 'icon']
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, message: `El campo ${field} es obligatorio` },
          { status: 400 }
        )
      }
    }

    // Validar que la categoría exista
    if (!mongoose.Types.ObjectId.isValid(body.category?.toString())) {
      return NextResponse.json(
        { success: false, message: 'ID de categoría no válido' },
        { status: 400 }
      )
    }

    const categoryExists = await Category.findById(body.category)
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: 'La categoría especificada no existe' },
        { status: 400 }
      )
    }

    // Validar que tenga al menos una característica
    if (!body.features || !Array.isArray(body.features) || body.features.filter((f: string) => f.trim()).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Debe tener al menos una característica' },
        { status: 400 }
      )
    }

    // Limpiar y preparar datos
    const productData = {
      ...body,
      features: body.features.filter((feature: string) => feature.trim().length > 0),
      title: body.title.trim(),
      description: body.description.trim(),
      price: body.price.trim()
    }

    // Crear producto
    const product = new Product(productData)
    await product.save()

    // Obtener el producto con la categoría poblada
    const populatedProduct = await Product.findById(product._id).populate('category')

    return NextResponse.json({
      success: true,
      message: 'Producto creado exitosamente',
      data: populatedProduct
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating product:', error)
    
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, message: validationErrors.join(', ') },
        { status: 400 }
      )
    }

    // Error de duplicado
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Ya existe un producto con esos datos' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
