import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Reiniciando modelo de Mongoose...')
    
    // Eliminar el modelo en caché si existe
    if (mongoose.models.CarouselSlide) {
      delete mongoose.models.CarouselSlide
      console.log('🗑️ Modelo CarouselSlide eliminado del caché')
    }

    // Reconectar a la base de datos
    await connectDB()

    // Reimportar el modelo (esto forzará la recreación)
    const { default: CarouselSlide } = await import('@/lib/models/CarouselSlide')
    
    console.log('📦 Modelo CarouselSlide reimportado')

    // Verificar el esquema actual
    const schema = CarouselSlide.schema
    const paths = schema.paths
    
    const schemaFields = Object.keys(paths).filter(path => !path.startsWith('_'))
    console.log('🔍 Campos del esquema:', schemaFields)

    // Verificar si backgroundOpacity está en el esquema
    const hasBackgroundOpacity = 'backgroundOpacity' in paths
    console.log(`🎯 backgroundOpacity en esquema: ${hasBackgroundOpacity}`)

    if (hasBackgroundOpacity) {
      const opacityPath = (paths as any).backgroundOpacity
      console.log('📋 Configuración de backgroundOpacity:', {
        type: opacityPath.instance,
        required: opacityPath.isRequired,
        default: (opacityPath as any).defaultValue || opacityPath.options?.default,
        min: opacityPath.options?.min,
        max: opacityPath.options?.max
      })
    }

    // Intentar crear un documento de prueba en memoria (sin guardarlo)
    const testSlide = new CarouselSlide({
      title: 'Test',
      description: 'Test description',
      features: ['test feature'],
      icon: 'shield',
      ctaText: 'Test CTA',
      ctaSecondary: 'Test Secondary',
      backgroundOpacity: 0.5
    })

    console.log('🧪 Documento de prueba creado:', {
      title: testSlide.title,
      backgroundOpacity: (testSlide as any).backgroundOpacity,
      hasBackgroundOpacity: (testSlide as any).backgroundOpacity !== undefined
    })

    // Obtener estadísticas de la colección actual
    const totalSlides = await CarouselSlide.countDocuments()
    const slidesWithOpacity = await CarouselSlide.countDocuments({
      backgroundOpacity: { $exists: true }
    })

    return NextResponse.json({
      success: true,
      message: 'Modelo reiniciado exitosamente',
      modelInfo: {
        schemaFields,
        hasBackgroundOpacityInSchema: hasBackgroundOpacity,
        testDocumentOpacity: (testSlide as any).backgroundOpacity
      },
      collectionStats: {
        totalSlides,
        slidesWithOpacity,
        slidesWithoutOpacity: totalSlides - slidesWithOpacity
      }
    })

  } catch (error: unknown) {
    console.error('❌ Error reiniciando modelo:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al reiniciar modelo',
        error: error instanceof Error ? (error instanceof Error ? error.message : String(error)) : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { default: CarouselSlide } = await import('@/lib/models/CarouselSlide')
    
    // Información del modelo actual
    const schema = CarouselSlide.schema
    const paths = schema.paths
    const schemaFields = Object.keys(paths).filter(path => !path.startsWith('_'))
    
    return NextResponse.json({
      success: true,
      modelInfo: {
        exists: !!mongoose.models.CarouselSlide,
        schemaFields,
        hasBackgroundOpacity: 'backgroundOpacity' in paths,
        backgroundOpacityConfig: paths.backgroundOpacity ? {
          type: (paths as any).backgroundOpacity.instance,
          required: (paths as any).backgroundOpacity.isRequired,
          default: ((paths as any).backgroundOpacity as any).defaultValue || (paths as any).backgroundOpacity.options?.default
        } : null
      }
    })

  } catch (error: unknown) {
    console.error('Error obteniendo info del modelo:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener información del modelo',
        error: error instanceof Error ? (error instanceof Error ? error.message : String(error)) : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
