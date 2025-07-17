import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/lib/models/Category'
import Product from '@/lib/models/Product'
import mongoose from 'mongoose'

// GET - Obtener categoría por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const { id } = params

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'ID de categoría no válido' },
        { status: 400 }
      )
    }

    // Buscar categoría
    const category = await Category.findById(id).lean()

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener categoría' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar categoría
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const { id } = params
    const body = await request.json()

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'ID de categoría no válido' },
        { status: 400 }
      )
    }

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

    // Actualizar categoría
    const category = await Category.findByIdAndUpdate(id, categoryData, {
      new: true,
      runValidators: true
    })

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category
    })

  } catch (error: any) {
    console.error('Error updating category:', error)
    
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

// DELETE - Eliminar categoría
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const { id } = params

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'ID de categoría no válido' },
        { status: 400 }
      )
    }

    // Verificar si existen productos asociados
    const productsCount = await Product.countDocuments({ category: id })
    if (productsCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `No se puede eliminar la categoría porque tiene ${productsCount} producto(s) asociado(s). Primero elimine o reasigne los productos.` 
        },
        { status: 400 }
      )
    }

    // Eliminar categoría
    const category = await Category.findByIdAndDelete(id)

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
