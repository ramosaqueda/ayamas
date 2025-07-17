'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'bordered' | 'shadow' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
}

const Card = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick
}: CardProps) => {
  const variants = {
    default: 'bg-white',
    bordered: 'bg-white border border-neutral-200',
    shadow: 'bg-white shadow-lg',
    elevated: 'bg-white shadow-ayamas-lg'
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const baseClasses = cn(
    'rounded-xl transition-all duration-300',
    variants[variant],
    paddings[padding],
    hover && 'hover:shadow-ayamas-lg hover:-translate-y-1 cursor-pointer',
    onClick && 'cursor-pointer',
    className
  )

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

const CardHeader = ({ children, className = '' }: CardHeaderProps) => (
  <div className={cn('mb-4', className)}>
    {children}
  </div>
)

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

const CardTitle = ({ children, className = '' }: CardTitleProps) => (
  <h3 className={cn('text-lg font-semibold text-neutral-800', className)}>
    {children}
  </h3>
)

interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

const CardDescription = ({ children, className = '' }: CardDescriptionProps) => (
  <p className={cn('text-sm text-neutral-600', className)}>
    {children}
  </p>
)

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

const CardContent = ({ children, className = '' }: CardContentProps) => (
  <div className={cn('', className)}>
    {children}
  </div>
)

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

const CardFooter = ({ children, className = '' }: CardFooterProps) => (
  <div className={cn('mt-4 pt-4 border-t border-neutral-200', className)}>
    {children}
  </div>
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
