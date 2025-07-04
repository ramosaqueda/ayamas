'use client'

import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  number?: string
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'button' | 'floating' | 'inline'
}

const WhatsAppButton = ({ 
  number = '+56994366143',
  message = 'Hola, me gustaría obtener información sobre sus servicios de seguros.',
  className = '',
  size = 'md',
  variant = 'button'
}: WhatsAppButtonProps) => {
  const whatsappURL = `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const variants = {
    button: 'inline-flex items-center bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl',
    floating: 'fixed bottom-20 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40',
    inline: 'inline-flex items-center text-green-600 hover:text-green-700 transition-colors duration-300'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  if (variant === 'floating') {
    return (
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${variants[variant]} ${className}`}
        title="Escribir por WhatsApp"
      >
        <MessageCircle className={iconSizes[size]} />
      </a>
    )
  }

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${variants[variant]} ${sizes[size]} ${className}`}
    >
      <MessageCircle className={`${iconSizes[size]} ${variant === 'inline' ? '' : 'mr-2'}`} />
      {variant !== 'floating' && (
        <span>
          {variant === 'inline' ? 'WhatsApp' : 'Escribir por WhatsApp'}
        </span>
      )}
    </a>
  )
}

export default WhatsAppButton
