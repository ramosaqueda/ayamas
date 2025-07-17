'use client'

import { useState } from 'react'
import { Eye, Settings } from 'lucide-react'

const TransparencyTest = () => {
  const [testOpacity, setTestOpacity] = useState(0.3)
  const [showTest, setShowTest] = useState(false)

  const testImageUrl = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"

  if (!showTest) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prueba de Transparencia</h3>
            <p className="text-sm text-gray-600">Prueba rápida para verificar que la transparencia funciona correctamente</p>
          </div>
          <button
            onClick={() => setShowTest(true)}
            className="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Mostrar Prueba
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Settings className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Prueba de Transparencia</h3>
        </div>
        <button
          onClick={() => setShowTest(false)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Ocultar
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 min-w-[200px]">
            Transparencia: {Math.round(testOpacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={testOpacity}
            onChange={(e) => setTestOpacity(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Método Anterior (Incorrecto) */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">❌ Método Anterior (Incorrecto)</h4>
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${testImageUrl})`,
                  opacity: testOpacity
                }}
              />
              <div className="relative z-10 p-4 text-white">
                <h5 className="font-bold">Título del Slide</h5>
                <p className="text-sm">El gradiente domina sobre la imagen</p>
              </div>
            </div>
          </div>

          {/* Método Correcto */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">✅ Método Correcto (Actual)</h4>
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              {/* Imagen de fondo */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${testImageUrl})`
                }}
              />
              
              {/* Overlay de gradiente con opacidad ajustable */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"
                style={{
                  opacity: 1 - testOpacity
                }}
              />
              
              <div className="relative z-10 p-4 text-white">
                <h5 className="font-bold">Título del Slide</h5>
                <p className="text-sm">La imagen se ve según la transparencia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="text-sm font-medium text-blue-900 mb-1">Explicación:</h5>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>0%</strong>: Solo se ve el color/gradiente (imagen completamente oculta)</li>
            <li>• <strong>50%</strong>: Mezcla equilibrada entre imagen y color</li>
            <li>• <strong>100%</strong>: Solo se ve la imagen (gradiente completamente transparente)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TransparencyTest
