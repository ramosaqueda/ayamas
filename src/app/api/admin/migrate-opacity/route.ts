import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CarouselSlide from '@/lib/models/CarouselSlide'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Verificar si es necesaria la migración
    const slidesWithoutOpacity = await CarouselSlide.countDocuments({
      backgroundOpacity: { $exists: false }
    })

    if (slidesWithoutOpacity === 0) {
      return NextResponse.json({
        success: true,
        message: 'No hay slides para migrar. Todos ya tienen el campo backgroundOpacity.',
        updated: 0,
        alreadyUpdated: await CarouselSlide.countDocuments()
      })
    }

    // Ejecutar la migración
    const result = await CarouselSlide.updateMany(
      { backgroundOpacity: { $exists: false } },
      { 
        $set: { 
          backgroundOpacity: 0.2  // Valor por defecto del 20%
        } 
      }
    )

    // Verificar que la migración fue exitosa
    const remainingSlides = await CarouselSlide.countDocuments({
      backgroundOpacity: { $exists: false }
    })

    return NextResponse.json({
      success: true,
      message: 'Migración de opacidad completada exitosamente',
      updated: result.modifiedCount,
      matched: result.matchedCount,
      remaining: remainingSlides,
      totalSlides: await CarouselSlide.countDocuments()
    })

  } catch (error) {
    console.error('Error en migración de opacidad:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al ejecutar la migración',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Verificar el estado de la migración
    const totalSlides = await CarouselSlide.countDocuments()
    const slidesWithOpacity = await CarouselSlide.countDocuments({
      backgroundOpacity: { $exists: true }
    })
    const slidesWithoutOpacity = await CarouselSlide.countDocuments({
      backgroundOpacity: { $exists: false }
    })

    return NextResponse.json({
      success: true,
      status: {
        totalSlides,
        slidesWithOpacity,
        slidesWithoutOpacity,
        migrationNeeded: slidesWithoutOpacity > 0,
        migrationProgress: totalSlides > 0 ? (slidesWithOpacity / totalSlides) * 100 : 100
      }
    })

  } catch (error) {
    console.error('Error al verificar estado de migración:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al verificar el estado',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
