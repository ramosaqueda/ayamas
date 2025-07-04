'use client'

import { useState } from 'react'
import { Star, Award, Users, Phone, Mail, MapPin } from 'lucide-react'
import QuoteForm from '@/components/ui/QuoteForm'

const Hero = () => {
  const trustIndicators = [
    {
      icon: <Award className="w-5 h-5" />,
      text: "Calificación AAA"
    },
    {
      icon: <Star className="w-5 h-5" />,
      text: "CMF Certificado"
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "+50,000 Clientes"
    }
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4K')] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in-up">
              A&A Más Corredores de Seguros{' '}
              <span className="text-secondary-500">Tu Protección</span>
              </h1>
              <p className="text-xl text-white/90 max-w-xl animate-fade-in-up animation-delay-200">
              Corredores independientes comprometidos con ayudarte a tomar las mejores decisiones. 
              Transparencia, profesionalismo y respaldo garantizado.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
              <button className="btn btn-secondary px-8 py-4 text-lg font-semibold">
                Cotizar Ahora
              </button>
              <button className="btn btn-outline px-8 py-4 text-lg font-semibold text-white border-white hover:bg-white hover:text-primary-500">
                Ver Productos
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 animate-fade-in-up animation-delay-600">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                    {indicator.icon}
                  </div>
                  <span className="text-sm font-medium">{indicator.text}</span>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 animate-fade-in-up animation-delay-800">
              <div className="flex items-center gap-3 text-white/90">
                <Phone className="w-5 h-5" />
                <span className="text-sm">600 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <Mail className="w-5 h-5" />
                <span className="text-sm">contacto@segurosayamas.cl</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Santiago, Chile</span>
              </div>
            </div>
          </div>

          {/* Quote Form */}
          <div className="animate-fade-in-up animation-delay-400">
            <QuoteForm />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/20 to-transparent"></div>
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-secondary-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </section>
  )
}

export default Hero
