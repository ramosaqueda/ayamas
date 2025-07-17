import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'
import mongoose from 'mongoose'

interface RouteParams {
  params: {
    id: string
  }
}

// GET - Obtener producto por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'ID de producto inválido' },
        { status: 400 }
      )
    }

    const product = await Product.findById(params.id).populate('category').lean()

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener producto' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar producto
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'ID de producto inválido' },
        { status: 400 }
      )
    }

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
    if (!mongoose.Types.ObjectId.isValid(body.category)) {
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
    if (!body.features || !Array.isArray(body.features) || body.features.filter(f => f.trim()).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Debe tener al menos una característica' },
        { status: 400 }
      )
    }

    // Limpiar y preparar datos
    const updateData = {
      ...body,
      features: body.features.filter((feature: string) => feature.trim().length > 0),
      title: body.title.trim(),
      description: body.description.trim(),
      price: body.price.trim(),
      updatedAt: new Date()
    }

    // Actualizar producto
    const product = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { 
        new: true, 
        runValidators: true
      }
    ).populate('category')

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    })

  } catch (error: any) {
    console.error('Error updating product:', error)
    
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, message: validationErrors.join(', ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar producto
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'ID de producto inválido' },
        { status: 400 }
      )
    }

    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}
