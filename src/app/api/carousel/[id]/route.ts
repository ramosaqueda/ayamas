import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CarouselSlide from '@/lib/models/CarouselSlide'
import mongoose from 'mongoose'

interface RouteParams {
  params: {
    id: string
  }
}

// GET - Obtener slide por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id?.toString())) {
      return NextResponse.json(
        { success: false, message: 'ID de slide inválido' },
        { status: 400 }
      )
    }

    const slide = await CarouselSlide.findById(params.id).lean()

    if (!slide) {
      return NextResponse.json(
        { success: false, message: 'Slide no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: slide
    })

  } catch (error: unknown) {
    console.error('Error fetching carousel slide:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener slide' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar slide
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id?.toString())) {
      return NextResponse.json(
        { success: false, message: 'ID de slide inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validar datos requeridos
    const requiredFields = ['title', 'description', 'icon', 'ctaText']
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, message: `El campo ${field} es obligatorio` },
          { status: 400 }
        )
      }
    }

    // Validar que tenga al menos una característica
    if (!body.features || !Array.isArray(body.features) || body.features.filter((f: string) => f.trim()).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Debe tener al menos una característica' },
        { status: 400 }
      )
    }

    // Validar stats solo si se proporcionan
    if ((body as any).stats && typeof (body as any).stats === 'object') {
      // Validar rating solo si se proporciona
      if ((body as any).stats.rating !== undefined && ((body as any).stats.rating < 1 || (body as any).stats.rating > 5)) {
        return NextResponse.json(
          { success: false, message: 'La calificación debe estar entre 1 y 5' },
          { status: 400 }
        )
      }
    }

    // Validar opacidad
    if ((body as any).backgroundOpacity !== undefined && ((body as any).backgroundOpacity < 0 || (body as any).backgroundOpacity > 1)) {
      return NextResponse.json(
        { success: false, message: 'La opacidad debe estar entre 0 y 1' },
        { status: 400 }
      )
    }

    // Limpiar y preparar datos
    const updateData = {
      ...body,
      features: body.features.filter((feature: string) => feature.trim().length > 0).slice(0, 4), // Máximo 4 features
      title: body.title.trim(),
      description: body.description.trim(),
      price: body.price ? body.price.trim() : undefined,
      ctaText: body.ctaText.trim(),
      ctaSecondary: (body as any).ctaSecondary.trim(),
      backgroundOpacity: body.backgroundOpacity ?? 0.2, // Valor por defecto
      updatedAt: new Date()
    }

    // Actualizar slide
    const slide = await CarouselSlide.findByIdAndUpdate(
      params.id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        lean: true
      }
    )

    if (!slide) {
      return NextResponse.json(
        { success: false, message: 'Slide no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Slide actualizado exitosamente',
      data: slide
    })

  } catch (error: any) {
    console.error('Error updating carousel slide:', error)
    
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

// DELETE - Eliminar slide
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id?.toString())) {
      return NextResponse.json(
        { success: false, message: 'ID de slide inválido' },
        { status: 400 }
      )
    }

    const slide = await CarouselSlide.findByIdAndDelete(params.id)

    if (!slide) {
      return NextResponse.json(
        { success: false, message: 'Slide no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Slide eliminado exitosamente'
    })

  } catch (error: unknown) {
    console.error('Error deleting carousel slide:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar slide' },
      { status: 500 }
    )
  }
}
