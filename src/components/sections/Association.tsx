'use client'

import { Award, CheckCircle, ExternalLink, Users, Shield, BookOpen } from 'lucide-react'

const Association = () => {
  const benefits = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Certificación Profesional",
      description: "Respaldo oficial de nuestras competencias y conocimientos en el sector"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Código de Ética",
      description: "Adherimos a estrictos códigos de ética profesional y buenas prácticas"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Educación Continua",
      description: "Actualización constante en normativas y tendencias del mercado asegurador"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Red Profesional",
      description: "Conexión con la comunidad de corredores más grande de Chile"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJkb3RzIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4zIi8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIiAvPgo8L3N2Zz4K')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Association Banner */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20">
            {/* Icon */}
            <div className="w-20 h-20 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-neutral-800" />
            </div>

            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Somos Asociados al
            </h2>
            <h3 className="text-2xl lg:text-3xl font-bold text-secondary-500 mb-8 leading-tight">
              Colegio de Corredores y Asesores Previsionales de Chile
            </h3>

            {/* Description */}
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Esta asociación nos respalda como profesionales certificados y nos compromete 
              con los más altos estándares de calidad y ética en el sector de seguros y previsión.
            </p>

            {/* CTA Button */}
            <button className="inline-flex items-center bg-secondary-500 text-neutral-800 px-8 py-4 rounded-lg font-semibold hover:bg-secondary-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
              <ExternalLink className="w-5 h-5 mr-2" />
              Conocer más sobre el Colegio
            </button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="text-secondary-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">
                {benefit.title}
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Statement */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h4 className="text-2xl font-bold text-white mb-4">
              Respaldo Profesional Garantizado
            </h4>
            <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Al elegir A&A Más Corredores de Seguros, no solo obtienes nuestro servicio personalizado, 
              sino también el respaldo de una institución que vela por la excelencia profesional 
              y la protección de los consumidores en Chile.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-500 mb-2">25+</div>
                <div className="text-white/80">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-500 mb-2">100%</div>
                <div className="text-white/80">Certificados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-500 mb-2">1000+</div>
                <div className="text-white/80">Clientes Atendidos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-secondary-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </section>
  )
}

export default Association
