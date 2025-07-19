'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-neutral-600 ${className}`}>
      <Link 
        href="/" 
        className="flex items-center hover:text-primary-600 transition-colors"
      >
        <Home size={16} className="mr-1" />
        <span>Inicio</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight size={16} className="text-neutral-400" />
          {(item as any).href && !item.active ? (
            <Link 
              href={(item as any).href}
              className="hover:text-primary-600 transition-colors capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className={`capitalize ${item.active ? 'text-primary-600 font-medium' : ''}`}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
