import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import { News } from '@/lib/models'

// GET - Obtener una noticia específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de noticia requerido' 
        },
        { status: 400 }
      )
    }

    const news = await News.findById(id).lean()
    
    if (!news) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Noticia no encontrada' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: news
    })
    
  } catch (error) {
    console.error('Error fetching news by ID:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener la noticia' 
      },
      { status: 500 }
    )
  }
}

// PUT - Actualizar una noticia
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de noticia requerido' 
        },
        { status: 400 }
      )
    }

    // Verificar que la noticia existe
    const existingNews = await News.findById(id)
    
    if (!existingNews) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Noticia no encontrada' 
        },
        { status: 404 }
      )
    }

    // Validar campos requeridos (removemos 'image' de los campos obligatorios)
    const requiredFields = ['title', 'description', 'author', 'category']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `El campo ${field} es obligatorio` 
          },
          { status: 400 }
        )
      }
    }

    // Si no hay imagen, usar una imagen por defecto
    if (!body.image || body.image.trim() === '') {
      body.image = '/images/default-news.svg' // Imagen por defecto
    }

    // Actualizar la noticia
    const updatedNews = await News.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    )

    return NextResponse.json({
      success: true,
      data: updatedNews,
      message: 'Noticia actualizada exitosamente'
    })
    
  } catch (error: any) {
    console.error('Error updating news:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error de validación', 
          details: errors 
        },
        { status: 400 }
      )
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya existe una noticia con ese slug' 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar la noticia' 
      },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar una noticia
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de noticia requerido' 
        },
        { status: 400 }
      )
    }

    // Verificar que la noticia existe
    const existingNews = await News.findById(id)
    
    if (!existingNews) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Noticia no encontrada' 
        },
        { status: 404 }
      )
    }

    // Eliminar la noticia
    await News.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Noticia eliminada exitosamente'
    })
    
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar la noticia' 
      },
      { status: 500 }
    )
  }
}
