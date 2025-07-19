import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CarouselSlide from '@/lib/models/CarouselSlide'

// GET - Obtener todos los slides con filtros opcionales
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
    const limitNumber = parseInt(limit || '20')
    const skip = (pageNumber - 1) * limitNumber

    // Obtener slides
    const slides = await CarouselSlide.find(filters)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean()

    // Obtener total para paginación
    const total = await CarouselSlide.countDocuments(filters)

    return NextResponse.json({
      success: true,
      data: slides,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      }
    })
  } catch (error: unknown) {
    console.error('Error fetching carousel slides:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener slides del carrusel' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo slide
export async function POST(request: NextRequest) {
  try {
    await connectDB()

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
    const slideData = {
      ...body,
      features: body.features.filter((feature: string) => feature.trim().length > 0).slice(0, 4), // Máximo 4 features
      title: body.title.trim(),
      description: body.description.trim(),
      price: body.price ? body.price.trim() : undefined,
      ctaText: body.ctaText.trim(),
      ctaSecondary: (body as any).ctaSecondary.trim(),
      backgroundOpacity: body.backgroundOpacity ?? 0.2 // Valor por defecto
    }

    // Crear slide
    const slide = new CarouselSlide(slideData)
    await slide.save()

    return NextResponse.json({
      success: true,
      message: 'Slide creado exitosamente',
      data: slide
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating carousel slide:', error)
    
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
        { success: false, message: 'Ya existe un slide con esos datos' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Reordenar slides
export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const { slideIds } = await request.json()

    if (!Array.isArray(slideIds)) {
      return NextResponse.json(
        { success: false, message: 'slideIds debe ser un array' },
        { status: 400 }
      )
    }

    // Reordenar slides usando el método estático del modelo
    await CarouselSlide.reorderSlides(slideIds)

    return NextResponse.json({
      success: true,
      message: 'Slides reordenados exitosamente'
    })

  } catch (error: unknown) {
    console.error('Error reordering slides:', error)
    return NextResponse.json(
      { success: false, message: 'Error al reordenar slides' },
      { status: 500 }
    )
  }
}
