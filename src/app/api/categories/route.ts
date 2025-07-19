import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/lib/models/Category'

// GET - Obtener todas las categorías con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')

    // Construir filtros
    const filters: any = {}
    if (active !== null) filters.active = active === 'true'

    // Configurar paginación
    const pageNumber = parseInt(page || '1')
    const limitNumber = parseInt(limit || '50')
    const skip = (pageNumber - 1) * limitNumber

    // Obtener categorías
    const categories = await Category.find(filters)
      .sort({ order: 1, name: 1 })
      .skip(skip)
      .limit(limitNumber)
      .lean()

    // Obtener total para paginación
    const total = await Category.countDocuments(filters)

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      }
    })
  } catch (error: unknown) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener categorías' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva categoría
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validar datos requeridos
    const requiredFields = ['name']
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, message: `El campo ${field} es obligatorio` },
          { status: 400 }
        )
      }
    }

    // Limpiar y preparar datos
    const categoryData = {
      ...body,
      name: body.name.trim()
    }

    // Crear categoría
    const category = new Category(categoryData)
    await category.save()

    return NextResponse.json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating category:', error)
    
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
        { success: false, message: 'Ya existe una categoría con ese slug' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
