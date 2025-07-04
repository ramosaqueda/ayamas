'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: 'María González',
      location: 'Santiago',
      avatar: 'MG',
      rating: 5,
      text: 'Excelente servicio. Cuando tuve mi siniestro, resolvieron todo rápidamente y sin complicaciones. La atención personalizada hace la diferencia. Recomiendo A&A+ Seguros 100%.',
      product: 'Seguro Automotriz',
      date: 'Hace 2 meses'
    },
    {
      id: 2,
      name: 'Carlos Hernández',
      location: 'Valparaíso',
      avatar: 'CH',
      rating: 5,
      text: '25 años siendo cliente y nunca me han fallado. Atención personalizada y precios justos. La mejor aseguradora de Chile sin duda alguna.',
      product: 'Seguro de Hogar',
      date: 'Hace 1 mes'
    },
    {
      id: 3,
      name: 'Ana López',
      location: 'Concepción',
      avatar: 'AL',
      rating: 5,
      text: 'Mi seguro de hogar me salvó cuando hubo un incendio. El proceso fue rápido y eficiente. El equipo de siniestros fue muy profesional. Gracias A&A+ Seguros.',
      product: 'Seguro de Hogar',
      date: 'Hace 3 semanas'
    },
    {
      id: 4,
      name: 'Roberto Silva',
      location: 'La Serena',
      avatar: 'RS',
      rating: 5,
      text: 'Contraté el seguro de vida para proteger a mi familia. La asesoría fue excelente y el precio muy competitivo. Me siento tranquilo sabiendo que están protegidos.',
      product: 'Seguro de Vida',
      date: 'Hace 1 semana'
    },
    {
      id: 5,
      name: 'Patricia Morales',
      location: 'Temuco',
      avatar: 'PM',
      rating: 5,
      text: 'El seguro de salud ha sido fundamental para mi familia. Atención médica de calidad y reembolsos rápidos. Muy recomendado.',
      product: 'Seguro de Salud',
      date: 'Hace 2 semanas'
    }
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index)
    setIsAutoPlaying(false)
  }

  const currentTestimonialData = testimonials[currentTestimonial]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Miles de familias confían en nosotros para proteger lo que más valoran
          </p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-neutral-50 rounded-3xl p-8 lg:p-12 shadow-lg">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-primary-500/20">
              <Quote className="w-16 h-16" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Rating */}
              <div className="flex items-center justify-center mb-6">
                {[...Array(currentTestimonialData.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-6 h-6 text-yellow-400 fill-current" 
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-xl lg:text-2xl text-neutral-700 text-center mb-8 leading-relaxed">
                "{currentTestimonialData.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {currentTestimonialData.avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-neutral-800 text-lg">
                    {currentTestimonialData.name}
                  </div>
                  <div className="text-neutral-600">
                    {currentTestimonialData.location}
                  </div>
                  <div className="text-sm text-primary-500">
                    {currentTestimonialData.product} • {currentTestimonialData.date}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-neutral-600 hover:text-primary-500 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-neutral-600 hover:text-primary-500 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-primary-500 w-8'
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <div className="text-white/90">Calificación Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-white/90">Clientes Satisfechos</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2,450+</div>
              <div className="text-white/90">Reseñas Positivas</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-neutral-800 mb-4">
            ¿Quieres ser el próximo en compartir tu experiencia?
          </h3>
          <p className="text-neutral-600 mb-6">
            Únete a miles de familias que ya protegen lo que más valoran
          </p>
          <button className="btn btn-primary px-8 py-3 text-lg">
            Comenzar Ahora
          </button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
