import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CarouselSlide from '@/lib/models/CarouselSlide'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { slideId } = await request.json()

    if (!slideId) {
      return NextResponse.json({
        success: false,
        message: 'slideId es requerido'
      }, { status: 400 })
    }

    // Obtener el slide actual
    const slide = await CarouselSlide.findById(slideId)
    
    if (!slide) {
      return NextResponse.json({
        success: false,
        message: 'Slide no encontrado'
      }, { status: 404 })
    }

    console.log('🔍 Slide antes de actualizar:', JSON.stringify(slide, null, 2))

    // Actualizar el slide con backgroundOpacity si no lo tiene
    if ((slide as any).backgroundOpacity === undefined || (slide as any).backgroundOpacity === null) {
      (slide as any).backgroundOpacity = 0.2
      await slide.save()
      console.log('✅ Slide actualizado con backgroundOpacity: 0.2')
    }

    // Volver a obtener el slide para confirmar
    const updatedSlide = await CarouselSlide.findById(slideId)
    console.log('🔍 Slide después de actualizar:', JSON.stringify(updatedSlide, null, 2))

    return NextResponse.json({
      success: true,
      message: 'Slide depurado y actualizado',
      before: slide,
      after: updatedSlide
    })

  } catch (error: unknown) {
    console.error('Error en debug-slide:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al depurar slide',
        error: error instanceof Error ? (error instanceof Error ? error.message : String(error)) : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Obtener todos los slides y mostrar su estado
    const slides = await CarouselSlide.find({}).lean()
    
    const slideStatus = slides.map(slide => ({
      _id: slide._id,
      title: slide.title,
      hasBackgroundOpacity: (slide as any).backgroundOpacity !== undefined && (slide as any).backgroundOpacity !== null,
      backgroundOpacity: (slide as any).backgroundOpacity,
      backgroundImage: (slide as any).backgroundImage
    }))

    return NextResponse.json({
      success: true,
      totalSlides: slides.length,
      slidesWithOpacity: slideStatus.filter(s => s.hasBackgroundOpacity).length,
      slidesWithoutOpacity: slideStatus.filter(s => !s.hasBackgroundOpacity).length,
      slideDetails: slideStatus
    })

  } catch (error: unknown) {
    console.error('Error al obtener estado de slides:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener estado',
        error: error instanceof Error ? (error instanceof Error ? error.message : String(error)) : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
