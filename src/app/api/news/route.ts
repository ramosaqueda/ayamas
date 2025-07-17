import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import { News } from '@/lib/models'

// GET - Obtener todas las noticias
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    
    // Para el admin, permitir ver todas las noticias
    const isAdmin = searchParams.get('admin') === 'true'
    
    // Solo aplicar filtros de published/active si NO es admin
    const published = isAdmin ? null : (searchParams.get('published') !== 'false')
    const active = isAdmin ? null : (searchParams.get('active') !== 'false')
    
    const limit = parseInt(searchParams.get('limit') || '0')
    
    let query: any = {}
    
    // Solo filtrar por active/published si no es admin
    if (!isAdmin) {
      if (active !== null) {
        query.active = true
      }
      
      if (published !== null) {
        query.published = true
      }
    } else {
      // Para admin, permitir filtros específicos
      if (searchParams.get('published') !== null) {
        query.published = searchParams.get('published') === 'true'
      }
      if (searchParams.get('active') !== null) {
        query.active = searchParams.get('active') === 'true'
      }
    }
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    console.log('News API Query:', query, 'isAdmin:', isAdmin)
    
    // Construir la consulta
    let newsQuery = News.find(query)
    
    // Aplicar búsqueda si existe
    if (search) {
      if (isAdmin) {
        // Para admin, buscar en todas las noticias sin restricciones
        const searchQuery = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
          ]
        }
        newsQuery = News.find({ ...query, ...searchQuery })
      } else {
        // Para público, usar el método search existente
        newsQuery = News.search(search)
      }
    }
    
    // Aplicar ordenamiento
    newsQuery = newsQuery.sort({ publishedAt: -1, createdAt: -1 })
    
    // Aplicar límite si existe
    if (limit > 0) {
      newsQuery = newsQuery.limit(limit)
    }
    
    const news = await newsQuery.lean()
    
    console.log('News found:', news.length)
    
    return NextResponse.json({
      success: true,
      data: news,
      count: news.length
    })
    
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener las noticias' 
      },
      { status: 500 }
    )
  }
}

// POST - Crear una nueva noticia
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
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
    
    // Crear la noticia
    const news = new News(body)
    await news.save()
    
    return NextResponse.json({
      success: true,
      data: news,
      message: 'Noticia creada exitosamente'
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Error creating news:', error)
    
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
        error: 'Error al crear la noticia' 
      },
      { status: 500 }
    )
  }
}
