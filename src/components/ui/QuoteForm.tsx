'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send } from 'lucide-react'

interface QuoteFormData {
  tipoSeguro: string
  nombre: string
  email: string
  telefono: string
  mensaje?: string
}

const QuoteForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<QuoteFormData>()

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Datos del formulario:', data)
      setSubmitStatus('success')
      reset()
      
      // Aquí iría la lógica real de envío
      // Por ejemplo: enviar a una API, servicio de email, etc.
      
    } catch (error: unknown) {
      console.error('Error al enviar:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const tiposSeguro = [
    { value: '', label: 'Selecciona un tipo de seguro' },
    { value: 'auto', label: 'Seguro Automotriz' },
    { value: 'hogar', label: 'Seguro de Hogar' },
    { value: 'vida', label: 'Seguro de Vida' },
    { value: 'salud', label: 'Seguro de Salud' },
    { value: 'viaje', label: 'Seguro de Viaje' },
    { value: 'empresarial', label: 'Seguro Empresarial' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-ayamas-xl p-8 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-primary-500 mb-2">
          Cotiza tu Seguro
        </h3>
        <p className="text-neutral-600">
          Obtén una cotización personalizada en minutos
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo de Seguro */}
        <div>
          <label htmlFor="tipoSeguro" className="block text-sm font-semibold text-neutral-700 mb-2">
            Tipo de Seguro *
          </label>
          <select
            id="tipoSeguro"
            {...register('tipoSeguro', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
          >
            {tiposSeguro.map(tipo => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          {errors.tipoSeguro && (
            <p className="mt-1 text-sm text-red-600">{errors.tipoSeguro.message}</p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-semibold text-neutral-700 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="nombre"
            {...register('nombre', { 
              required: 'Este campo es obligatorio',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' }
            })}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            placeholder="Tu nombre completo"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            {...register('email', { 
              required: 'Este campo es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className="block text-sm font-semibold text-neutral-700 mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            id="telefono"
            {...register('telefono', { 
              required: 'Este campo es obligatorio',
              pattern: {
                value: /^[+]?[\d\s\-\(\)]+$/,
                message: 'Teléfono inválido'
              }
            })}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            placeholder="+56 9 1234 5678"
          />
          {errors.telefono && (
            <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
          )}
        </div>

        {/* Mensaje opcional */}
        <div>
          <label htmlFor="mensaje" className="block text-sm font-semibold text-neutral-700 mb-2">
            Mensaje (opcional)
          </label>
          <textarea
            id="mensaje"
            {...register('mensaje')}
            rows={3}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none"
            placeholder="Cuéntanos más sobre tus necesidades..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Obtener Cotización
            </>
          )}
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
            ¡Gracias! Hemos recibido tu solicitud. Te contactaremos pronto.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="text-center p-4 bg-red-100 text-red-800 rounded-lg">
            Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.
          </div>
        )}
      </form>

      {/* Trust Badge */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
          <span>🔒</span>
          <span>Tus datos están protegidos</span>
        </div>
      </div>
    </div>
  )
}

export default QuoteForm
