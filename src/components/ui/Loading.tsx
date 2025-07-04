'use client'

import { Loader2, Shield } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'pulse' | 'dots' | 'brand'
  text?: string
  className?: string
}

const Loading = ({ size = 'md', variant = 'spinner', text, className = '' }: LoadingProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const renderSpinner = () => (
    <Loader2 className={`animate-spin text-primary-500 ${sizes[size]} ${className}`} />
  )

  const renderPulse = () => (
    <div className={`animate-pulse bg-primary-500 rounded-full ${sizes[size]} ${className}`} />
  )

  const renderDots = () => (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-primary-500 rounded-full animate-bounce ${
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )

  const renderBrand = () => (
    <div className={`animate-pulse text-primary-500 ${className}`}>
      <Shield className={sizes[size]} />
    </div>
  )

  const renderVariant = () => {
    switch (variant) {
      case 'pulse':
        return renderPulse()
      case 'dots':
        return renderDots()
      case 'brand':
        return renderBrand()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderVariant()}
      {text && (
        <p className={`text-neutral-600 ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  )
}

export default Loading
