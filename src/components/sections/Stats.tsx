'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react'

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('stats-section')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: '25',
      suffix: '+',
      label: 'Años de Experiencia',
      description: 'Más de dos décadas protegiendo familias chilenas'
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: '50',
      suffix: 'K+',
      label: 'Clientes Satisfechos',
      description: 'Familias y empresas que confían en nosotros'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      number: '99.5',
      suffix: '%',
      label: 'Siniestros Resueltos',
      description: 'Índice de resolución exitosa de siniestros'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      number: '24',
      suffix: '/7',
      label: 'Atención al Cliente',
      description: 'Soporte disponible todos los días del año'
    }
  ]

  const AnimatedNumber = ({ 
    number, 
    suffix, 
    duration = 2000 
  }: { 
    number: string
    suffix: string
    duration?: number 
  }) => {
    const [displayNumber, setDisplayNumber] = useState('0')
    
    useEffect(() => {
      if (!isVisible) return

      const numericValue = parseFloat(number)
      const increment = numericValue / (duration / 50)
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setDisplayNumber(number)
          clearInterval(timer)
        } else {
          setDisplayNumber(current.toFixed(number.includes('.') ? 1 : 0))
        }
      }, 50)
      
      return () => clearInterval(timer)
    }, [isVisible, number, duration])

    return (
      <span className="text-4xl lg:text-5xl font-bold text-white">
        {displayNumber}{suffix}
      </span>
    )
  }

  return (
    <section 
      id="stats-section"
      className="py-20 bg-gradient-to-r from-primary-500 to-primary-600 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJkb3RzIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4zIi8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIiAvPgo8L3N2Zz4K')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Números que Hablan por Nosotros
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Más de 25 años de experiencia nos respaldan como líderes en el sector asegurador
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`text-center group ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full text-white group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  {stat.icon}
                </div>
                
                {/* Number */}
                <div className="space-y-2">
                  <AnimatedNumber 
                    number={stat.number} 
                    suffix={stat.suffix}
                  />
                  <h3 className="text-lg lg:text-xl font-semibold text-white">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-white/80 max-w-xs">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4">
            <span className="text-white font-medium">
              ¿Quieres ser parte de estas estadísticas?
            </span>
            <button className="bg-secondary-500 text-neutral-800 px-6 py-2 rounded-full font-semibold hover:bg-secondary-600 transition-colors">
              Cotizar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-secondary-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </section>
  )
}

export default Stats
