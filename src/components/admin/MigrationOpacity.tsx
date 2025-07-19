'use client'

import { useState, useEffect } from 'react'
import { Database, AlertCircle, CheckCircle, RefreshCw, Play } from 'lucide-react'

interface MigrationStatus {
  totalSlides: number
  slidesWithOpacity: number
  slidesWithoutOpacity: number
  migrationNeeded: boolean
  migrationProgress: number
}

const MigrationOpacity = () => {
  const [status, setStatus] = useState<MigrationStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [debugging, setDebugging] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const checkMigrationStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/migrate-opacity')
      const data = await response.json()
      
      if (data.success) {
        setStatus(data.status)
      } else {
        setError(data.message || 'Error al verificar el estado')
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error('Error checking migration status:', err)
    } finally {
      setLoading(false)
    }
  }

  const runMigration = async () => {
    try {
      setMigrating(true)
      setError(null)
      setMessage(null)
      
      const response = await fetch('/api/admin/migrate-opacity', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        setMessage(`✅ ${data.message}. Slides actualizados: ${data.updated}`)
        // Actualizar el estado después de la migración
        await checkMigrationStatus()
      } else {
        setError(data.message || 'Error al ejecutar la migración')
      }
    } catch (err) {
      setError('Error al ejecutar la migración')
      console.error('Error running migration:', err)
    } finally {
      setMigrating(false)
    }
  }

  const runDebug = async () => {
    try {
      setDebugging(true)
      setError(null)
      setMessage(null)
      
      // Primero obtener el estado de todos los slides
      const statusResponse = await fetch('/api/admin/debug-slide')
      const statusData = await statusResponse.json()
      
      if (statusData.success) {
        setDebugInfo(statusData)
        
        // Si hay slides sin opacidad, intentar arreglar el primero
        const slideWithoutOpacity = statusData.slideDetails.find((s: any) => !s.hasBackgroundOpacity)
        
        if (slideWithoutOpacity) {
          const fixResponse = await fetch('/api/admin/debug-slide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slideId: slideWithoutOpacity._id })
          })
          
          const fixData = await fixResponse.json()
          
          if (fixData.success) {
            setMessage(`✅ Slide "${slideWithoutOpacity.title}" arreglado exitosamente`)
            await checkMigrationStatus() // Actualizar estado
          } else {
            setError(fixData.message || 'Error al arreglar slide')
          }
        } else {
          setMessage('✅ Todos los slides ya tienen backgroundOpacity')
        }
      } else {
        setError(statusData.message || 'Error al obtener estado de debug')
      }
    } catch (err) {
      setError('Error durante la depuración')
      console.error('Error during debug:', err)
    } finally {
      setDebugging(false)
    }
  }

  useEffect(() => {
    checkMigrationStatus()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Database className="w-6 h-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-medium text-gray-900">
          Migración: Campo de Opacidad
        </h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Esta migración agrega el campo <code className="bg-gray-100 px-1 rounded">backgroundOpacity</code> 
          a todos los slides del carrusel existentes con un valor por defecto del 20%.
        </p>

        {/* Estado actual */}
        {loading ? (
          <div className="flex items-center text-sm text-gray-500">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Verificando estado...
          </div>
        ) : status ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Estado Actual:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Total de slides</div>
                <div className="font-medium">{status.totalSlides}</div>
              </div>
              <div>
                <div className="text-gray-500">Con opacidad</div>
                <div className="font-medium text-green-600">{status.slidesWithOpacity}</div>
              </div>
              <div>
                <div className="text-gray-500">Sin opacidad</div>
                <div className="font-medium text-red-600">{status.slidesWithoutOpacity}</div>
              </div>
              <div>
                <div className="text-gray-500">Progreso</div>
                <div className="font-medium">{Math.round(status.migrationProgress)}%</div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${status.migrationProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Mensajes */}
        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-green-700">{message}</span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center space-x-3 pt-4 border-t">
          <button
            onClick={checkMigrationStatus}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Verificar Estado
          </button>

          {status?.migrationNeeded && (
            <>
              <button
                onClick={runMigration}
                disabled={migrating}
                className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {migrating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {migrating ? 'Ejecutando...' : 'Ejecutar Migración'}
              </button>
              
              <button
                onClick={runDebug}
                disabled={debugging}
                className="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {debugging ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2" />
                )}
                {debugging ? 'Depurando...' : 'Debug & Fix'}
              </button>
            </>
          )}

          {status && !status.migrationNeeded && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Migración completada
            </div>
          )}
        </div>

        {/* Información de Debug */}
        {debugInfo && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Información de Debug:</h5>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Total slides: {debugInfo.totalSlides}</div>
              <div>Con opacidad: {debugInfo.slidesWithOpacity}</div>
              <div>Sin opacidad: {debugInfo.slidesWithoutOpacity}</div>
              {debugInfo.slideDetails.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">Ver detalles de slides</summary>
                  <div className="mt-2 space-y-1">
                    {debugInfo.slideDetails.map((slide: any) => (
                      <div key={slide._id.toString()} className="text-xs bg-white p-2 rounded border">
                        <div><strong>{slide.title}</strong></div>
                        <div>Opacidad: {slide.hasBackgroundOpacity ? (slide as any).backgroundOpacity : 'NO DEFINIDA'}</div>
                        <div>Imagen: {slide.backgroundImage ? 'Sí' : 'No'}</div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Advertencia */}
        {status?.migrationNeeded && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <strong>Importante:</strong> Esta operación modificará la base de datos. 
                Se recomienda hacer un respaldo antes de ejecutar la migración.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MigrationOpacity
