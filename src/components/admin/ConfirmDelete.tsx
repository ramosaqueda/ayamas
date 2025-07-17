'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface ConfirmDeleteProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName?: string
  loading?: boolean
}

const ConfirmDelete = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false
}: ConfirmDeleteProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-neutral-600">{message}</p>
              {itemName && (
                <p className="text-sm font-medium text-neutral-900 mt-2">
                  "{itemName}"
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDelete
