'use client'

import { Building2, Building, ExternalLink, Shield, FileText, BarChart3, Users, Lock, Clock } from 'lucide-react'

const BrokerisSection = () => {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Gestión de Pólizas",
      description: "Control total sobre todas sus pólizas activas"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Reportes Consolidados", 
      description: "Información financiera y estadísticas detalladas"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Seguimiento de Siniestros",
      description: "Monitoreo en tiempo real del estado de siniestros"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Acceso Seguro",
      description: "Plataforma protegida con máxima seguridad"
    }
  ]

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-6">
            Brokeris
          </h1>
          
          <h2 className="text-xl lg:text-2xl text-primary-600 font-semibold mb-4">
            La más moderna herramienta para la gestión y consulta de Pólizas y Siniestros
          </h2>
          
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Acceda a la plataforma y gestione de forma integral toda la información de sus seguros.
          </p>
          
          <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 group"
            >
              <div className="text-primary-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Holdings Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-primary-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10">
              {/* Icon and Title */}
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                    Sistema Brokeris para Holdings
                  </h3>
                  <div className="flex items-center text-sm text-blue-600 mb-4">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Grupos de Empresas</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-600 leading-relaxed mb-6">
                Si Ud. pertenece a un grupo de empresas o Holding, aquí podrá ver toda la información consolidada 
                de todas las entidades del grupo en una sola plataforma integrada.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-neutral-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Vista consolidada de todo el grupo empresarial</span>
                </div>
                <div className="flex items-center text-sm text-neutral-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Reportes financieros unificados</span>
                </div>
                <div className="flex items-center text-sm text-neutral-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Gestión centralizada de pólizas y siniestros</span>
                </div>
                <div className="flex items-center text-sm text-neutral-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Control de riesgos a nivel holding</span>
                </div>
              </div>

              {/* Access Button */}
              <a
                href="https://aya.brokeris.cl/holding/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl w-full justify-center"
              >
                <Lock className="w-5 h-5 mr-2" />
                Acceder al Sistema Holdings
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>

          {/* Empresas Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-primary-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10">
              {/* Icon and Title */}
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                    Sistema Brokeris Empresas
                  </h3>
                  <div className="flex items-center text-sm text-green-600 mb-4">
                    <Building className="w-4 h-4 mr-1" />
                    <span>Empresas Individuales</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-600 leading-relaxed mb-6">
                Si Ud. pertenece a una empresa, aquí podrá ver toda la información consolidada 
                de los seguros contratados y gestionar eficientemente sus pólizas y siniestros.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-neutral-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Información completa de seguros contratados</span>
                </div>
                <div className="flex items-center text-sm text-neutral-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Seguimiento detallado de siniestros</span>
                </div>
                <div className="flex items-center text-sm text-neutral-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Reportes personalizados por empresa</span>
                </div>
                <div className="flex items-center text-sm text-neutral-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Acceso directo a documentos de pólizas</span>
                </div>
              </div>

              {/* Access Button */}
              <a
                href="https://aya.brokeris.cl/EMPRESAS/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl w-full justify-center"
              >
                <Lock className="w-5 h-5 mr-2" />
                Acceder al Sistema Empresas
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold">Disponibilidad 24/7</h3>
          </div>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Ambas plataformas están disponibles las 24 horas del día, los 7 días de la semana. 
            Acceda desde cualquier dispositivo y en cualquier momento.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Disponibilidad</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">100%</div>
              <div className="text-white/80">Seguro</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">∞</div>
              <div className="text-white/80">Accesos</div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-neutral-800 mb-2">
              ¿Necesita ayuda con el acceso?
            </h4>
            <p className="text-neutral-600 mb-4">
              Nuestro equipo técnico está disponible para asistirle con el acceso a las plataformas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-primary-600">
                <span className="mr-2">📞</span>
                <span>+56 9 9436 6143</span>
              </div>
              <div className="flex items-center text-primary-600">
                <span className="mr-2">📧</span>
                <span>soporte@ayamasseguros.cl</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrokerisSection
