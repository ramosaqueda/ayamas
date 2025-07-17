'use client'

import { useState } from 'react'
import { ArrowLeft, Database, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const MigrationPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    type: 'migrate' | 'rollback' | null
  }>({ success: false, message: '', type: null })

  const executeMigration = async (action: 'migrate' | 'rollback') => {
    setLoading(true)
    setResult({ success: false, message: '', type: null })

    try {
      const url = action === 'rollback' 
        ? '/api/admin/migrate-categories?action=rollback'
        : '/api/admin/migrate-categories'

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      setResult({
        success: data.success,
        message: data.message || (data.success ? 'Operación completada' : 'Error en la operación'),
        type: action
      })
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        type: action
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Dashboard
              </button>
              <div className="ml-4 border-l border-gray-300 pl-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Migración de Categorías
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información sobre la migración */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Información sobre la Migración
              </h2>
              <div className="text-blue-800 space-y-2">
                <p>
                  Esta herramienta migra las categorías de productos de strings hardcodeados 
                  a una colección escalable de MongoDB con referencias por ObjectId.
                </p>
                <p>
                  <strong>Importante:</strong> Haz un respaldo de tu base de datos antes de ejecutar la migración.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resultado */}
        {result.message && (
          <div className={`mb-8 p-4 rounded-lg border ${
            result.success
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {result.success ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertTriangle className="w-5 h-5 mr-2" />
              )}
              <span className="font-medium">
                {result.type === 'migrate' ? 'Migración' : 'Rollback'} {result.success ? 'Exitosa' : 'Fallida'}
              </span>
            </div>
            <p className="mt-2">{result.message}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ejecutar Migración */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Database className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ejecutar Migración
                </h3>
                <p className="text-sm text-gray-600">
                  Migra las categorías a la nueva estructura escalable
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Esta migración:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Crea la colección de categorías</li>
                <li>• Migra productos a usar referencias ObjectId</li>
                <li>• Mantiene compatibilidad con datos existentes</li>
                <li>• Incluye validaciones de integridad</li>
              </ul>
            </div>

            <button
              onClick={() => executeMigration('migrate')}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && result.type === 'migrate' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ejecutando...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Ejecutar Migración
                </>
              )}
            </button>
          </div>

          {/* Rollback */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center mb-4">
              <RotateCcw className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Rollback
                </h3>
                <p className="text-sm text-gray-600">
                  Revierte la migración a la estructura anterior
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Esta operación:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Convierte referencias ObjectId a strings</li>
                <li>• Restaura la estructura legacy</li>
                <li>• Mantiene los datos de productos</li>
                <li>• Permite volver al estado anterior</li>
              </ul>
            </div>

            <button
              onClick={() => executeMigration('rollback')}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && result.type === 'rollback' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ejecutando...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Ejecutar Rollback
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instrucciones adicionales */}
        <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Instrucciones Adicionales
          </h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900">Línea de Comandos:</h4>
              <p>También puedes ejecutar la migración desde la terminal:</p>
              <code className="block mt-2 bg-gray-100 p-2 rounded">
                npx tsx src/scripts/migrate-categories.ts
              </code>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Rollback por Comando:</h4>
              <code className="block mt-2 bg-gray-100 p-2 rounded">
                npx tsx src/scripts/migrate-categories.ts --rollback
              </code>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Verificación:</h4>
              <p>Después de la migración, visita la sección de categorías para verificar que todo funcione correctamente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MigrationPage
