'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Imagen',
  accept = 'image/*',
  maxSize = 5,
  className = ''
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [urlValidating, setUrlValidating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validar si una URL es válida
  const validateImageUrl = async (url: string): Promise<boolean> => {
    if (!url) return false
    
    try {
      // Si es una URL local de uploads, siempre es válida
      if (url.startsWith('/uploads/')) {
        return true
      }
      
      // Si es una URL relativa o local, es válida
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        return true
      }
      
      // Validar formato de URL para URLs absolutas
      const urlObj = new URL(url)
      
      // Para URLs externas, intentar cargar la imagen
      return new Promise((resolve) => {
        const img = document.createElement('img')
        
        const timeout = setTimeout(() => {
          img.onload = null
          img.onerror = null
          resolve(false)
        }, 5000)
        
        img.onload = () => {
          clearTimeout(timeout)
          resolve(true)
        }
        
        img.onerror = () => {
          clearTimeout(timeout)
          resolve(false)
        }
        
        img.src = url
      })
    } catch {
      return false
    }
  }

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      alert(`La imagen debe ser menor a ${maxSize}MB`)
      return
    }

    try {
      setUploading(true)
      setImageError(false)
      
      // Crear FormData para enviar el archivo
      const formData = new FormData()
      formData.append('file', file)

      // Subir imagen
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Error al subir la imagen')
      }

      const data = await response.json()
      
      if (data.success && data.url) {
        // Para URLs locales, no validar inmediatamente ya que el archivo se acaba de subir
        onChange(data.url)
        setImageError(false)
        console.log('Imagen subida exitosamente:', data.url)
      } else {
        throw new Error(data.message || 'Error al procesar la imagen')
      }
    } catch (error: unknown) {
      console.error('Error uploading image:', error)
      alert('Error al subir la imagen. Inténtalo de nuevo.')
      setImageError(true)
    } finally {
      setUploading(false)
    }
  }

  const handleUrlChange = async (url: string) => {
    onChange(url)
    setImageError(false)
    
    // Solo validar URLs externas, no las locales
    if (url && url.trim() && !url.startsWith('/uploads/')) {
      setUrlValidating(true)
      const isValid = await validateImageUrl(url)
      setImageError(!isValid)
      setUrlValidating(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    onChange('')
    setImageError(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="space-y-4">
        {/* Preview de la imagen actual */}
        {value && (
          <div className="relative">
            <div className={`relative w-full max-w-md h-48 rounded-lg overflow-hidden border bg-gray-50 ${
              imageError ? 'border-red-300' : 'border-gray-200'
            }`}>
              {imageError ? (
                <div className="flex flex-col items-center justify-center h-full text-red-500">
                  <AlertCircle size={32} className="mb-2" />
                  <p className="text-sm text-center px-4">Error al cargar la imagen</p>
                  <p className="text-xs text-gray-500 text-center px-4 mt-1">Verifica que la URL sea válida</p>
                </div>
              ) : (
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.log('Error loading image:', value)
                    // Solo marcar como error si no es una URL local recien subida
                    if (!value.startsWith('/uploads/')) {
                      setImageError(true)
                    }
                  }}
                  onLoad={() => {
                    setImageError(false)
                  }}
                />
              )}
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
              title="Eliminar imagen"
            >
              <X size={16} />
            </button>
            <div className="mt-2 text-xs text-gray-500 truncate max-w-md">
              {value.startsWith('/uploads/') ? '✅ Imagen subida localmente' : '🌐 Imagen externa'}
              {imageError && !value.startsWith('/uploads/') && <span className="text-red-500 ml-2">⚠️ Error de carga</span>}
            </div>
          </div>
        )}

        {/* Área de subida */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {value ? (
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
              )}
              <p className="text-sm text-gray-600 mb-1">
                {value ? 'Cambiar imagen' : 'Subir imagen'}
              </p>
              <p className="text-xs text-gray-500">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Máximo {maxSize}MB • JPG, PNG, GIF
              </p>
            </div>
          )}
        </div>

        {/* Campo de URL manual como alternativa */}
        <div className="relative">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="O pega una URL de imagen"
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                imageError && value && !value.startsWith('/uploads/') ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {urlValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              </div>
            )}
            {imageError && value && !urlValidating && !value.startsWith('/uploads/') && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
            )}
          </div>
          {imageError && value && !value.startsWith('/uploads/') && (
            <p className="text-xs text-red-500 mt-1">
              ⚠️ No se pudo cargar la imagen desde esta URL
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
