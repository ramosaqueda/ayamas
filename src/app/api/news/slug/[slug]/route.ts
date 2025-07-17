import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import { News } from '@/lib/models'

// GET - Obtener una noticia por slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()
    
    const { slug } = params
    
    if (!slug) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Slug de noticia requerido' 
        },
        { status: 400 }
      )
    }

    console.log('Searching for news with slug:', slug)

    // Buscar la noticia por slug
    const news = await News.findOne({ 
      slug: slug.toLowerCase(),
      published: true,
      active: true 
    }).lean()
    
    console.log('Found news:', news ? 'YES' : 'NO')
    
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
    console.error('Error fetching news by slug:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener la noticia' 
      },
      { status: 500 }
    )
  }
}
