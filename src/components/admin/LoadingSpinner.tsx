'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

const LoadingSpinner = ({ size = 'md', text, className = '' }: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-2">
        <div className={`animate-spin rounded-full border-2 border-primary-500 border-t-transparent ${sizes[size]}`} />
        {text && <span className="text-sm text-neutral-600">{text}</span>}
      </div>
    </div>
  )
}

export default LoadingSpinner
