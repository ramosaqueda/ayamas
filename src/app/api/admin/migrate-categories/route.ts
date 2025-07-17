import { NextRequest, NextResponse } from 'next/server'
import { migrateCategories, rollbackMigration } from '@/scripts/migrate-categories'

// POST - Ejecutar migración
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'rollback') {
      await rollbackMigration()
      return NextResponse.json({
        success: true,
        message: 'Rollback de migración ejecutado exitosamente'
      })
    } else {
      await migrateCategories()
      return NextResponse.json({
        success: true,
        message: 'Migración de categorías ejecutada exitosamente'
      })
    }
  } catch (error) {
    console.error('Error en migración:', error)
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
