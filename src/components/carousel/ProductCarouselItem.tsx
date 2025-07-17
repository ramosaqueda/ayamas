'use client'

import { ArrowRight, Star, Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProductCarouselItemProps {
  id: string
  icon: React.ReactNode
  title: string
  subtitle?: string
  description: string
  price: string
  originalPrice?: string
  period?: string
  features: string[]
  color: string
  popular?: boolean
  discount?: string
  badge?: string
  href?: string
}

const ProductCarouselItem = ({ 
  id, 
  icon, 
  title, 
  subtitle, 
  description, 
  price, 
  originalPrice,
  period, 
  features, 
  color, 
  popular = false,
  discount,
  badge,
  href
}: ProductCarouselItemProps) => {
  const handleClick = () => {
    if (href) {
      window.open(href, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
        popular ? 'ring-2 ring-primary-500' : ''
      }`}
      onClick={handleClick}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-0 right-0 bg-secondary-500 text-neutral-800 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
          MÁS POPULAR
        </div>
      )}

      {/* Custom Badge */}
      {badge && !popular && (
        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          {badge}
        </div>
      )}

      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          {discount}
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">
        {/* Icon and Price */}
        <div className="flex items-start justify-between mb-4">
          <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${color} text-white group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {originalPrice && (
                <span className="text-sm text-neutral-500 line-through">
                  {originalPrice}
                </span>
              )}
              <div className="text-2xl font-bold text-primary-500">
                {price}
              </div>
            </div>
            {period && (
              <div className="text-sm text-neutral-600">
                {period}
              </div>
            )}
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-neutral-800 mb-1 group-hover:text-primary-500 transition-colors duration-300">
            {title}
          </h3>
          {subtitle && (
            <h4 className="text-sm font-medium text-neutral-600 mb-2">
              {subtitle}
            </h4>
          )}
          <p className="text-neutral-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">
            Incluye:
          </h4>
          <ul className="space-y-2">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start text-sm text-neutral-600">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {features.length > 3 && (
            <div className="text-sm text-primary-500 mt-2 font-medium">
              +{features.length - 3} beneficios más
            </div>
          )}
        </div>

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center justify-center gap-2 group">
          <span>Cotizar Ahora</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Rating (if applicable) */}
        {popular && (
          <div className="flex items-center justify-center mt-4 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-neutral-600 ml-2">4.9/5</span>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}

export default ProductCarouselItem
