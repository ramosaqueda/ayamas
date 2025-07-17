'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, X } from 'lucide-react'

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  onClose?: () => void
  className?: string
}

const Alert = ({ type, title, message, onClose, className = '' }: AlertProps) => {
  const [visible, setVisible] = useState(true)

  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  if (!visible) return null

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle
  }

  const Icon = icons[type]

  return (
    <div className={`p-4 border rounded-lg ${styles[type]} ${className}`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mt-0.5 mr-3" />
        <div className="flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={handleClose}
            className="ml-3 p-1 hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert
