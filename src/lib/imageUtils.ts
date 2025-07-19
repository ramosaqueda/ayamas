// Utilidad para comprimir y redimensionar imágenes en el cliente
// Esta función se puede usar antes de subir para mejorar el rendimiento

export interface ImageCompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1200,
      maxHeight = 800,
      quality = 0.8,
      format = 'jpeg'
    } = options

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = document.createElement("img")

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo proporción
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      // Configurar canvas
      canvas.width = width
      canvas.height = height

      // Dibujar imagen redimensionada
      ctx?.drawImage(img, 0, 0, width, height)

      // Convertir a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File(
              [blob],
              `compressed_${file.name}`,
              {
                type: `image/${format}`,
                lastModified: Date.now()
              }
            )
            resolve(compressedFile)
          } else {
            reject(new Error('Error al comprimir imagen'))
          }
        },
        `image/${format}`,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Error al cargar imagen'))
    }

    img.src = URL.createObjectURL(file)
  })
}

// Función para validar dimensiones de imagen
export function validateImageDimensions(
  file: File,
  minWidth = 0,
  minHeight = 0,
  maxWidth = Infinity,
  maxHeight = Infinity
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = document.createElement("img")
    
    img.onload = () => {
      const { width, height } = img
      const isValid = 
        width >= minWidth &&
        height >= minHeight &&
        width <= maxWidth &&
        height <= maxHeight
      
      resolve(isValid)
    }
    
    img.onerror = () => resolve(false)
    img.src = URL.createObjectURL(file)
  })
}

// Función para obtener dimensiones de imagen
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img")
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    
    img.onerror = () => {
      reject(new Error('Error al cargar imagen'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}
