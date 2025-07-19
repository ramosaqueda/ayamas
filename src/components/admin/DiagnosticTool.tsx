'use client'

import { useState } from 'react'
import { RefreshCw, AlertTriangle, CheckCircle, Wrench, Database, Bug } from 'lucide-react'

const DiagnosticTool = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostic = async () => {
    try {
      setLoading(true)
      setError(null)
      setResults(null)

      console.log('🔍 Iniciando diagnóstico completo...')

      // 1. Verificar modelo
      const modelResponse = await fetch('/api/admin/reset-model')
      const modelData = await modelResponse.json()

      // 2. Verificar estado de slides
      const debugResponse = await fetch('/api/admin/debug-slide')
      const debugData = await debugResponse.json()

      // 3. Intentar crear un slide de prueba (sin guardarlo en BD)
      const testData = {
        title: 'TEST SLIDE - NO GUARDAR',
        description: 'Slide de prueba para verificar backgroundOpacity',
        features: ['Test feature'],
        icon: 'shield',
        ctaText: 'Test',
        ctaSecondary: 'Test',
        backgroundOpacity: 0.7,
        stats: { rating: 4.5, clients: '100+' }
      }

      console.log('📤 Enviando datos de prueba:', testData)

      const testResponse = await fetch('/api/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })

      const testResult = await testResponse.json()
      console.log('📥 Respuesta del servidor:', testResult)

      setResults({
        model: modelData,
        debug: debugData,
        test: {
          success: testResponse.ok,
          data: testResult,
          sentData: testData
        },
        timestamp: new Date().toISOString()
      })

    } catch (err) {
      console.error('Error en diagnóstico:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const resetModel = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/reset-model', {
        method: 'POST'
      })

      const data = await response.json()
      
      if (data.success) {
        alert('✅ Modelo reiniciado exitosamente')
        await runDiagnostic() // Ejecutar diagnóstico después del reset
      } else {
        setError(data.message || 'Error al reiniciar modelo')
      }
    } catch (err) {
      setError('Error al reiniciar modelo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <Bug className="w-6 h-6 text-orange-600 mr-3" />
        <h3 className="text-lg font-medium text-gray-900">
          Herramienta de Diagnóstico
        </h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Esta herramienta diagnostica problemas con el campo backgroundOpacity y verifica que todo funcione correctamente.
        </p>

        {/* Botones de acción */}
        <div className="flex items-center space-x-3">
          <button
            onClick={runDiagnostic}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Diagnosticando...' : 'Ejecutar Diagnóstico'}
          </button>

          <button
            onClick={resetModel}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <Wrench className="w-4 h-4 mr-2" />
            Reiniciar Modelo
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Resultados */}
        {results && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Resultados del Diagnóstico:</h4>
            
            <div className="space-y-4 text-sm">
              {/* Estado del Modelo */}
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                  {results.model.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  )}
                  Estado del Modelo
                </h5>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Existe en caché: {results.model.modelInfo?.exists ? 'Sí' : 'No'}</div>
                  <div>Tiene backgroundOpacity: {results.model.modelInfo?.hasBackgroundOpacity ? 'Sí' : 'No'}</div>
                  <div>Campos del esquema: {results.model.modelInfo?.schemaFields?.length || 0}</div>
                </div>
              </div>

              {/* Estado de la Base de Datos */}
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                  {results.debug.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  )}
                  Estado de la Base de Datos
                </h5>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Total slides: {results.debug.totalSlides || 0}</div>
                  <div>Con backgroundOpacity: {results.debug.slidesWithOpacity || 0}</div>
                  <div>Sin backgroundOpacity: {results.debug.slidesWithoutOpacity || 0}</div>
                </div>
              </div>

              {/* Prueba de Creación */}
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                  {results.test.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  )}
                  Prueba de Creación de Slide
                </h5>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Éxito: {results.test.success ? 'Sí' : 'No'}</div>
                  <div>backgroundOpacity enviado: {(results.test.sentData as any).backgroundOpacity}</div>
                  {results.test.data.data && (
                    <div>backgroundOpacity guardado: {(results.test.data.data as any).backgroundOpacity || 'NO GUARDADO'}</div>
                  )}
                  {results.test.data.message && (
                    <div>Mensaje: {results.test.data.message}</div>
                  )}
                </div>
              </div>

              {/* Datos crudos para debugging */}
              <details className="bg-white p-3 rounded border">
                <summary className="cursor-pointer text-gray-700 font-medium">Ver datos crudos (para desarrolladores)</summary>
                <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-40">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="text-sm font-medium text-blue-900 mb-1">Instrucciones:</h5>
          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>Ejecuta el diagnóstico para ver el estado actual</li>
            <li>Si backgroundOpacity no está en el esquema, usa "Reiniciar Modelo"</li>
            <li>Si la prueba de creación falla, revisa los logs del servidor</li>
            <li>Elimina el slide de prueba después del diagnóstico</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default DiagnosticTool
