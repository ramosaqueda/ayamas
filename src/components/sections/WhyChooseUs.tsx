'use client'

import { Shield, UserCheck, Search, FileCheck, TrendingUp, Users } from 'lucide-react'

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Seguridad y Confianza",
      description: "Somos transparentes, te ofrecemos protección en el área de salud y seguros generales a precios éticos, sin comisiones fantasmas e incentivos perversos.",
      features: [
        "Precios éticos y transparentes",
        "Sin comisiones ocultas",
        "Protección integral en salud",
        "Seguros generales completos"
      ],
      color: "primary"
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Profesionales Independientes",
      description: "Sin duda, contratar a un corredor como mediador de seguros es la mejor opción para tu empresa. Sin vinculación con las compañías los corredores de seguros están en medio de la operación, mediando para que los riesgos asegurados queden completamente cubiertos en caso de siniestro.",
      features: [
        "Sin vinculación con aseguradoras",
        "Mediación profesional",
        "Cobertura completa de riesgos",
        "Mejores opciones del mercado"
      ],
      color: "secondary"
    }
  ]

  const processSteps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Búsqueda",
      description: "Buscamos entre las compañías aseguradoras cuál es la mejor opción para ti."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Análisis",
      description: "Realizamos un estudio financiero y analizamos los posibles riesgos."
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Evaluación",
      description: "Estudiamos las mejores ofertas del mercado según tu actividad."
    }
  ]

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
            Motivos de por qué Elegirnos
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Descubre las razones que nos convierten en tu mejor opción para proteger lo que más valoras
          </p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Main Reasons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              {/* Decorative Background */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${
                reason.color === 'primary' ? 'bg-primary-500/5' : 'bg-secondary-500/10'
              } rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500`}></div>
              
              <div className="relative z-10">
                {/* Icon and Title */}
                <div className="flex items-start mb-6">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center mr-4 ${
                    reason.color === 'primary' 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                      : 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-neutral-800'
                  }`}>
                    {reason.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-800 mb-2">
                      {reason.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-neutral-600 leading-relaxed mb-6">
                  {reason.description}
                </p>

                {/* Features List */}
                <div className="space-y-3">
                  {reason.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        reason.color === 'primary' ? 'bg-primary-500' : 'bg-secondary-500'
                      }`}></div>
                      <span className="text-sm text-neutral-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Our Process */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-neutral-800 mb-4">
              Nuestro Proceso de Trabajo
            </h3>
            <p className="text-neutral-600">
              Seguimos un proceso estructurado para encontrar la mejor opción para ti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 z-0"></div>
                )}
                
                <div className="relative z-10">
                  {/* Step Icon */}
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 relative">
                    {step.icon}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center text-xs font-bold text-neutral-800">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <h4 className="text-lg font-semibold text-neutral-800 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Message */}
        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
              <Users className="w-5 h-5 text-yellow-800" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                Importante: Protección Completa
              </h4>
              <p className="text-yellow-700">
                En ocasiones, nos hemos encontrado con empresas que no tienen totalmente cubierta su actividad y sus riesgos, 
                con pólizas generales y coberturas básicas. En caso de siniestro, el daño es doble. 
                <span className="font-semibold"> Nosotros nos aseguramos de que esto no te suceda.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
