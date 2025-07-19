'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Phone, Mail, MapPin, MessageCircle, Send, Clock } from 'lucide-react'

interface ContactFormData {
  nombre: string
  email: string
  telefono: string
  empresa?: string
  asunto: string
  mensaje: string
  tipoConsulta: 'consulta' | 'cotizacion' | 'reclamo' | 'sugerencia'
}

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Datos del formulario de contacto:', data)
      setSubmitStatus('success')
      reset()

      // Aquí iría la lógica real de envío

    } catch (error: unknown) {
      console.error('Error al enviar:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappNumber = '+56994366143'
  const whatsappMessage = 'Hola, me gustaría obtener información sobre sus servicios de seguros.'
  const whatsappURL = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`

  const tiposConsulta = [
    { value: 'consulta', label: 'Consulta General' },
    { value: 'cotizacion', label: 'Solicitar Cotización' },
    { value: 'reclamo', label: 'Reclamo o Siniestro' },
    { value: 'sugerencia', label: 'Sugerencia' },
  ]

  return (
    <section id="contacto" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-6">
            Contáctenos
          </h2>

          {/* Mission Text */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-lg lg:text-xl text-neutral-600 leading-relaxed">
              En A&A +, nuestra principal misión es ayudar a nuestros clientes para que tomen las mejores decisiones de vida,
              sabemos la importancia de sentirse seguro en cada momento, por esta razón,
              <span className="font-semibold text-primary-600"> estamos prestos a responder sus consultas y a considerar sus sugerencias.</span>
            </p>
          </div>

          <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">
                Información de Contacto
              </h3>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800">Teléfono</h4>
                    <p className="text-neutral-600">+56 9 9436 6143</p>
                    <p className="text-sm text-neutral-500">Lun - Vie: 9:00 - 18:00</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800">Email</h4>
                    <p className="text-neutral-600">contacto@segurosayamas.cl</p>
                    <p className="text-sm text-neutral-500">Respuesta en 24 horas</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800">Oficina</h4>
                    <p className="text-neutral-600">La Serena,Chile</p>
                    <p className="text-sm text-neutral-500">Atención con cita previa</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800">Horario de Atención</h4>
                    <p className="text-neutral-600">Lunes a Viernes</p>
                    <p className="text-sm text-neutral-500">9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Section */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold">¿Necesitas ayuda inmediata?</h3>
              </div>

              <p className="text-green-100 mb-6 leading-relaxed">
                Contáctanos por WhatsApp para recibir atención personalizada y respuestas rápidas a tus consultas.
              </p>

              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Escribir por WhatsApp
              </a>

              <div className="mt-4 text-sm text-green-100">
                📱 {whatsappNumber}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6">
              Envíanos un Mensaje
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    {...register('nombre', { required: 'Este campo es obligatorio' })}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder="Tu nombre completo"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                  )}
                </div>

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
              </div>

              {/* Phone and Company Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="telefono" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    {...register('telefono', { required: 'Este campo es obligatorio' })}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder="+56 9 1234 5678"
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="empresa" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    {...register('empresa')}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              {/* Subject and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tipoConsulta" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Tipo de Consulta *
                  </label>
                  <select
                    id="tipoConsulta"
                    {...register('tipoConsulta', { required: 'Este campo es obligatorio' })}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="">Selecciona un tipo</option>
                    {tiposConsulta.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                  {errors.tipoConsulta && (
                    <p className="mt-1 text-sm text-red-600">{errors.tipoConsulta.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="asunto" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    id="asunto"
                    {...register('asunto', { required: 'Este campo es obligatorio' })}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder="Asunto de tu consulta"
                  />
                  {errors.asunto && (
                    <p className="mt-1 text-sm text-red-600">{errors.asunto.message}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  {...register('mensaje', { required: 'Este campo es obligatorio' })}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none"
                  placeholder="Escribe tu consulta o sugerencia detalladamente..."
                />
                {errors.mensaje && (
                  <p className="mt-1 text-sm text-red-600">{errors.mensaje.message}</p>
                )}
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
                    Enviar Mensaje
                  </>
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
                  ¡Gracias por tu mensaje! Te contactaremos pronto.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="text-center p-4 bg-red-100 text-red-800 rounded-lg">
                  Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.
                </div>
              )}
            </form>

            {/* Privacy Notice */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
                <span>🔒</span>
                <span>Tus datos están protegidos y serán utilizados únicamente para contactarte</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
