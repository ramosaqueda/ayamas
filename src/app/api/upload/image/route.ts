import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Configuración de tipos de archivo permitidos
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando subida de imagen...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('No se recibió archivo')
      return NextResponse.json(
        { success: false, message: 'No se ha seleccionado ningún archivo' },
        { status: 400 }
      )
    }

    console.log('Archivo recibido:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log('Tipo de archivo no permitido:', file.type)
      return NextResponse.json(
        { success: false, message: `Tipo de archivo no permitido: ${file.type}. Solo se permiten: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validar tamaño
    if (file.size > MAX_SIZE) {
      console.log('Archivo demasiado grande:', file.size)
      return NextResponse.json(
        { success: false, message: `El archivo es demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo 5MB.` },
        { status: 400 }
      )
    }

    // Generar nombre único para el archivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const uniqueFileName = `${uuidv4()}.${fileExtension}`

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')
    try {
      await mkdir(uploadDir, { recursive: true })
      console.log('Directorio creado/verificado:', uploadDir)
    } catch (dirError) {
      console.log('Directorio ya existe o error menor:', dirError)
    }

    // Convertir archivo a buffer y guardarlo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, uniqueFileName)

    await writeFile(filePath, buffer)
    console.log('Archivo guardado en:', filePath)

    // Retornar URL pública del archivo
    const publicUrl = `/uploads/products/${uniqueFileName}`
    console.log('URL pública generada:', publicUrl)

    return NextResponse.json({
      success: true,
      message: 'Imagen subida exitosamente',
      url: publicUrl,
      filename: uniqueFileName,
      originalName: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error: unknown) {
    console.error('Error detallado al subir imagen:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor al procesar la imagen',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}

// También podemos implementar DELETE para eliminar imágenes
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { success: false, message: 'Nombre de archivo requerido' },
        { status: 400 }
      )
    }

    // Eliminar archivo del sistema
    const filePath = join(process.cwd(), 'public', 'uploads', 'products', filename)
    
    try {
      const fs = require('fs').promises
      await fs.unlink(filePath)
    } catch (error: unknown) {
      // Archivo no existe o ya fue eliminado
    }

    return NextResponse.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    })

  } catch (error: unknown) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
