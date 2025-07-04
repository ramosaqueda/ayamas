'use client'

import { Target, Heart, MessageCircle } from 'lucide-react'

const Mission = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              Nuestra Misión
            </h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full"></div>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-3xl p-8 lg:p-12 mb-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-500/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-500 mb-3">
                    Nuestra Principal Misión
                  </h3>
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    En A&A + LTDA, nuestra principal misión es{' '}
                    <span className="font-semibold text-primary-600">
                      ayudar a nuestros clientes para que tomen las mejores decisiones en su vida
                    </span>
                    , sabemos la importancia de sentirse seguro en cada momento, por esta razón, 
                    estamos prestos a responder sus consultas y a considerar sus sugerencias.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-primary-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-primary-500 mr-3" />
                <h3 className="text-xl font-semibold text-neutral-800">
                  Compromiso Personal
                </h3>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Entendemos que cada decisión de seguro es personal e importante. 
                Nos comprometemos a brindar atención personalizada y soluciones 
                adaptadas a las necesidades específicas de cada cliente.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-secondary-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-8 h-8 text-secondary-600 mr-3" />
                <h3 className="text-xl font-semibold text-neutral-800">
                  Comunicación Abierta
                </h3>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Mantenemos canales de comunicación abiertos, respondiendo 
                consultas de manera oportuna y valorando las sugerencias 
                de nuestros clientes para mejorar continuamente nuestro servicio.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-lg text-neutral-600 mb-6">
              ¿Tienes alguna consulta o sugerencia? Estamos aquí para escucharte.
            </p>
            <button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl">
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Mission
