'use client'

import { Calendar, Clock, ArrowRight, User, Tag } from 'lucide-react'
import { motion } from 'framer-motion'

interface NewsItem {
  id: string
  title: string
  subtitle?: string
  description: string
  image: string
  date: string
  author?: string
  category: string
  readTime?: string
  featured?: boolean
  href?: string
}

interface NewsCarouselItemProps {
  item: NewsItem
  index: number
}

const NewsCarouselItem = ({ item, index }: NewsCarouselItemProps) => {
  const handleClick = () => {
    if (item.href) {
      window.open(item.href, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      {/* Featured badge */}
      {item.featured && (
        <div className="absolute top-4 left-4 bg-secondary-500 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full z-10">
          DESTACADO
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta information */}
        <div className="flex items-center gap-4 mb-3 text-sm text-neutral-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(item.date).toLocaleDateString('es-CL')}</span>
          </div>
          {item.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{item.readTime}</span>
            </div>
          )}
          {item.author && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{item.author}</span>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="flex items-center gap-1 mb-3">
          <Tag className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-primary-500">{item.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-neutral-800 mb-2 group-hover:text-primary-500 transition-colors duration-300">
          {item.title}
        </h3>

        {/* Subtitle */}
        {item.subtitle && (
          <h4 className="text-sm font-medium text-neutral-600 mb-3">
            {item.subtitle}
          </h4>
        )}

        {/* Description */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>

        {/* Read more button */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium text-sm transition-colors duration-300">
            <span>Leer más</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}

export default NewsCarouselItem
