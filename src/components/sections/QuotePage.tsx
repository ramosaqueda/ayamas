'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Car, Home, Heart, Stethoscope, Plane, Building2, Send, CheckCircle, Info } from 'lucide-react'

interface QuoteFormData {
  tipoSeguro: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  rut?: string
  empresa?: string
  region: string
  ciudad: string
  mensaje?: string
  aceptaTerminos: boolean
}

const QuoteSection = () => {
  const [selectedInsurance, setSelectedInsurance] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<QuoteFormData>()

  const tipoSeguro = watch('tipoSeguro')

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Datos de cotización:', data)
      setSubmitStatus('success')
      reset()
      setSelectedInsurance('')
      
      // Aquí iría la lógica real de envío
      
    } catch (error: unknown) {
      console.error('Error al enviar cotización:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const insuranceTypes = [
    {
      value: '',
      label: 'Selecciona el tipo de seguro',
      icon: null,
      description: null
    },
    {
      value: 'auto',
      label: 'Seguro Automotriz',
      icon: <Car className="w-6 h-6" />,
      description: {
        title: 'Seguro Automotriz',
        subtitle: 'Protección completa para tu vehículo',
        content: 'Nuestro seguro automotriz ofrece cobertura integral para tu vehículo, incluyendo daños por accidentes, robo, incendio y responsabilidad civil.',
        features: [
          'Cobertura contra robo total y parcial',
          'Accidentes de tránsito y colisiones',
          'Responsabilidad civil hacia terceros',
          'Asistencia en carretera 24/7',
          'Grúa hasta 50km sin costo',
          'Auto de reemplazo',
          'Cristales y accesorios',
          'Fenómenos naturales'
        ],
        price: 'Desde $45.000/mes',
        benefits: [
          'Liquidación de siniestros en 48 horas',
          'Red de talleres especializados',
          'Peritaje gratuito',
          'Descuentos por no siniestralidad'
        ]
      }
    },
    {
      value: 'hogar',
      label: 'Seguro de Hogar',
      icon: <Home className="w-6 h-6" />,
      description: {
        title: 'Seguro de Hogar',
        subtitle: 'Tu hogar y patrimonio protegidos',
        content: 'Protege tu hogar, contenido y responsabilidad civil con nuestra cobertura integral que incluye daños por incendio, robo y fenómenos naturales.',
        features: [
          'Incendio y explosión',
          'Robo y hurto de contenido',
          'Daños por agua y humedad',
          'Fenómenos naturales (terremoto, tsunami)',
          'Responsabilidad civil familiar',
          'Gastos de habitación temporal',
          'Electrodomésticos y electrónicos',
          'Joyas y objetos de valor'
        ],
        price: 'Desde $28.000/mes',
        benefits: [
          'Tasación gratuita de inmueble',
          'Asesoría en prevención',
          'Reparación con materiales equivalentes',
          'Cobertura en el extranjero (60 días)'
        ]
      }
    },
    {
      value: 'vida',
      label: 'Seguro de Vida',
      icon: <Heart className="w-6 h-6" />,
      description: {
        title: 'Seguro de Vida',
        subtitle: 'Protege el futuro de tu familia',
        content: 'Asegura el bienestar económico de tus seres queridos con nuestro seguro de vida que incluye muerte natural, accidental y enfermedades críticas.',
        features: [
          'Muerte natural o accidental',
          'Invalidez total y permanente',
          'Enfermedades críticas (cáncer, infarto)',
          'Renta por incapacidad temporal',
          'Adelanto por enfermedad terminal',
          'Gastos funerarios',
          'Accidentes personales',
          'Beneficios fiscales'
        ],
        price: 'Desde $35.000/mes',
        benefits: [
          'Cobertura sin examen médico hasta cierta edad',
          'Beneficiarios múltiples',
          'Actualización automática por IPC',
          'Rehabilitación profesional incluida'
        ]
      }
    },
    {
      value: 'salud',
      label: 'Seguro de Salud',
      icon: <Stethoscope className="w-6 h-6" />,
      description: {
        title: 'Seguro de Salud',
        subtitle: 'Atención médica de calidad',
        content: 'Accede a la mejor atención médica privada con nuestro seguro de salud que cubre hospitalización, cirugías y tratamientos especializados.',
        features: [
          'Hospitalización médica y quirúrgica',
          'Cirugías ambulatorias',
          'Consultas con especialistas',
          'Exámenes diagnósticos',
          'Medicamentos oncológicos',
          'Medicina preventiva',
          'Urgencias médicas',
          'Maternidad y pediatría'
        ],
        price: 'Desde $62.000/mes',
        benefits: [
          'Red de clínicas y hospitales premium',
          'Telemedicina 24/7',
          'Sin períodos de carencia en urgencias',
          'Cobertura en el extranjero'
        ]
      }
    },
    {
      value: 'viaje',
      label: 'Seguro de Viaje',
      icon: <Plane className="w-6 h-6" />,
      description: {
        title: 'Seguro de Viaje',
        subtitle: 'Viaja tranquilo por el mundo',
        content: 'Protección integral para tus viajes nacionales e internacionales con cobertura médica, equipaje y cancelación.',
        features: [
          'Gastos médicos en el extranjero',
          'Repatriación médica y sanitaria',
          'Pérdida y retraso de equipaje',
          'Cancelación e interrupción de viaje',
          'Responsabilidad civil personal',
          'Asistencia legal',
          'Gastos de hotel por cuarentena',
          'Deportes de aventura'
        ],
        price: 'Desde $15.000/viaje',
        benefits: [
          'Cobertura mundial',
          'Asistencia 24/7 en español',
          'App móvil para emergencias',
          'Sin límite de edad'
        ]
      }
    },
    {
      value: 'empresarial',
      label: 'Seguro Empresarial',
      icon: <Building2 className="w-6 h-6" />,
      description: {
        title: 'Seguro Empresarial',
        subtitle: 'Protege tu negocio integralmente',
        content: 'Cobertura especializada para empresas que incluye responsabilidad civil, pérdida de beneficios y protección de activos.',
        features: [
          'Responsabilidad civil general',
          'Pérdida de beneficios',
          'Incendio de instalaciones',
          'Equipos y maquinarias',
          'Cyber riesgos y datos',
          'Fidelidad de empleados',
          'Transporte de mercancías',
          'Responsabilidad profesional'
        ],
        price: 'Desde $120.000/mes',
        benefits: [
          'Asesoría en gestión de riesgos',
          'Auditorías preventivas',
          'Capacitación en seguridad',
          'Respaldo jurídico especializado'
        ]
      }
    }
  ]

  const selectedDescription = insuranceTypes.find(type => type.value === tipoSeguro)?.description

  const regiones = [
    'Región Metropolitana',
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'O\'Higgins',
    'Maule',
    'Ñuble',
    'Biobío',
    'Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén',
    'Magallanes'
  ]

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
            Cotiza tu Seguro
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Obtén una cotización personalizada para el seguro que necesitas. 
            Completa el formulario y te contactaremos con la mejor propuesta del mercado.
          </p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-4">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-800">
                  Formulario de Cotización
                </h2>
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
                    onChange={(e) => setSelectedInsurance(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    {insuranceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.tipoSeguro && (
                    <p className="mt-1 text-sm text-red-600">{errors.tipoSeguro.message}</p>
                  )}
                </div>

                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      {...register('nombre', { required: 'Este campo es obligatorio' })}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="Tu nombre"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="apellido" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      id="apellido"
                      {...register('apellido', { required: 'Este campo es obligatorio' })}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="Tu apellido"
                    />
                    {errors.apellido && (
                      <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
                    )}
                  </div>
                </div>

                {/* Email y Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {/* RUT y Empresa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rut" className="block text-sm font-semibold text-neutral-700 mb-2">
                      RUT (opcional)
                    </label>
                    <input
                      type="text"
                      id="rut"
                      {...register('rut')}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="12.345.678-9"
                    />
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

                {/* Región y Ciudad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="region" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Región *
                    </label>
                    <select
                      id="region"
                      {...register('region', { required: 'Este campo es obligatorio' })}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                    >
                      <option value="">Selecciona tu región</option>
                      {regiones.map(region => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="ciudad" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      id="ciudad"
                      {...register('ciudad', { required: 'Este campo es obligatorio' })}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="Tu ciudad"
                    />
                    {errors.ciudad && (
                      <p className="mt-1 text-sm text-red-600">{errors.ciudad.message}</p>
                    )}
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Información Adicional (opcional)
                  </label>
                  <textarea
                    id="mensaje"
                    {...register('mensaje')}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none"
                    placeholder="Cuéntanos más detalles sobre tus necesidades..."
                  />
                </div>

                {/* Términos y Condiciones */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="aceptaTerminos"
                    {...register('aceptaTerminos', { required: 'Debes aceptar los términos y condiciones' })}
                    className="mt-1 mr-3 w-4 h-4 text-primary-500 border-2 border-neutral-200 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="aceptaTerminos" className="text-sm text-neutral-700">
                    Acepto los{' '}
                    <a href="#" className="text-primary-500 hover:text-primary-600 underline">
                      términos y condiciones
                    </a>{' '}
                    y autorizo el tratamiento de mis datos personales para efectos de la cotización.
                  </label>
                </div>
                {errors.aceptaTerminos && (
                  <p className="text-sm text-red-600">{errors.aceptaTerminos.message}</p>
                )}

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
                      Enviar Cotización
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
                    ¡Gracias! Hemos recibido tu solicitud de cotización. Te contactaremos pronto.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="text-center p-4 bg-red-100 text-red-800 rounded-lg">
                    Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Descripción del Seguro */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              {selectedDescription ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
                  {/* Header del seguro */}
                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 text-white">
                      {insuranceTypes.find(type => type.value === tipoSeguro)?.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                        {selectedDescription.title}
                      </h3>
                      <p className="text-primary-600 font-semibold">
                        {(selectedDescription as any).subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="text-neutral-600 leading-relaxed mb-6">
                    {selectedDescription.content}
                  </p>

                  {/* Precio */}
                  <div className="bg-primary-50 rounded-lg p-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600 mb-1">
                        {selectedDescription.price}
                      </div>
                      <div className="text-sm text-neutral-600">
                        Precio orientativo
                      </div>
                    </div>
                  </div>

                  {/* Características */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Coberturas Incluidas
                    </h4>
                    <div className="space-y-2">
                      {selectedDescription.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-neutral-700">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                      <Info className="w-5 h-5 text-blue-500 mr-2" />
                      Beneficios Adicionales
                    </h4>
                    <div className="space-y-2">
                      {selectedDescription.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center text-sm text-neutral-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg text-center">
                    <p className="text-neutral-800 font-semibold mb-2">
                      ¿Necesitas más información?
                    </p>
                    <p className="text-neutral-700 text-sm">
                      Completa el formulario y te daremos una cotización personalizada
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100 text-center">
                  <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Info className="w-10 h-10 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                    Selecciona un Tipo de Seguro
                  </h3>
                  <p className="text-neutral-600">
                    Elige el tipo de seguro que necesitas en el formulario y aquí aparecerá 
                    información detallada sobre coberturas, beneficios y precios orientativos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuoteSection
