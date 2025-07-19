import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import { News } from '@/lib/models'

// GET - Debug endpoint para ver todas las noticias sin filtros
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    console.log('Debug: Fetching ALL news from database...')
    
    // Obtener TODAS las noticias sin filtros
    const allNews = await News.find({}).lean()
    
    console.log('Debug: Total news found:', allNews.length)
    
    // Log detallado de cada noticia
    allNews.forEach((news, index) => {
      console.log(`News ${index + 1}:`, {
        id: news._id,
        title: news.title,
        slug: news.slug,
        published: news.published,
        active: news.active,
        category: news.category,
        createdAt: news.createdAt
      })
    })
    
    return NextResponse.json({
      success: true,
      total: allNews.length,
      data: allNews.map(news => ({
        _id: news._id,
        title: news.title,
        slug: news.slug,
        description: news.description,
        author: news.author,
        category: news.category,
        published: news.published,
        active: news.active,
        featured: news.featured,
        image: news.image,
        createdAt: news.createdAt,
        publishedAt: news.publishedAt
      }))
    })
    
  } catch (error: unknown) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error en debug',
        details: error instanceof Error ? (error instanceof Error ? error.message : String(error)) : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
