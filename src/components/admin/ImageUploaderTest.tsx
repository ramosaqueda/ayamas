'use client'

import { useState } from 'react'
import ImageUploader from './ImageUploader'

// Componente de prueba para verificar funcionalidad
export default function ImageUploaderTest() {
  const [imageUrl, setImageUrl] = useState('')

  const testUrls = [
    'https://images.pexels.com/photos/8205068/pexels-photo-8205068.jpeg',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
    'https://picsum.photos/800/600',
    '/uploads/products/test.jpg' // URL local de ejemplo
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Prueba de ImageUploader</h2>
      
      <ImageUploader
        value={imageUrl}
        onChange={setImageUrl}
        label="Imagen de Prueba"
        maxSize={5}
      />

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">URLs de Prueba:</h3>
        <div className="grid grid-cols-1 gap-2">
          {testUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setImageUrl(url)}
              className="text-left p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border truncate"
            >
              {url}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Valor Actual:</h3>
        <div className="p-3 bg-gray-50 rounded border">
          <code className="text-sm break-all">
            {imageUrl || 'Sin imagen seleccionada'}
          </code>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setImageUrl('')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Limpiar
        </button>
      </div>
    </div>
  )
}
