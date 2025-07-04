'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import Loading from './Loading'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl',
      secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-neutral-800 hover:from-secondary-600 hover:to-secondary-700 shadow-lg hover:shadow-xl',
      outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white bg-transparent',
      ghost: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 bg-transparent',
      destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl'
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    }

    const baseClasses = cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5',
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      className
    )

    return (
      <button
        className={baseClasses}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <Loading size="sm" variant="spinner" />
        ) : (
          <>
            {leftIcon && (
              <span className="mr-2">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="ml-2">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
