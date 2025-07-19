'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Productos', href: '#productos' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Brokeris', href: '/brokeris' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Cotizar', href: '/cotizar' },
    { name: 'Contacto', href: '/contacto' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-ayamas'
        : 'bg-white shadow-ayamas'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="group">
            <Logo size="md" className="hover:opacity-90 transition-opacity duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={(item as any).href}
                className="text-neutral-700 hover:text-primary-500 font-medium transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <Link
            href="#portal"
            className="hidden md:inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-full hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Portal Cliente
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg">
            <nav className="p-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={(item as any).href}
                  className="block py-2 text-neutral-700 hover:text-primary-500 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="#portal"
                className="block w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-full text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Portal Cliente
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
