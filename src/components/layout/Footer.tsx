'use client'

import Link from 'next/link'
import { Shield, Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { name: 'Seguro Automotriz', href: '/productos/auto' },
    { name: 'Seguro de Hogar', href: '/productos/hogar' },
    { name: 'Seguro de Vida', href: '/productos/vida' },
    { name: 'Seguro de Salud', href: '/productos/salud' },
    { name: 'Seguro de Viaje', href: '/productos/viaje' },
    { name: 'Seguro Empresarial', href: '/productos/empresarial' },
  ]

  const companyLinks = [
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Nuestro Equipo', href: '/equipo' },
    { name: 'Trabaja con Nosotros', href: '/carreras' },
    { name: 'Prensa', href: '/prensa' },
    { name: 'Responsabilidad Social', href: '/responsabilidad-social' },
  ]

  const supportLinks = [
    { name: 'Centro de Ayuda', href: '/ayuda' },
    { name: 'Reportar Siniestro', href: '/siniestros' },
    { name: 'Portal del Cliente', href: '/portal' },
    { name: 'Documentos Legales', href: '/documentos' },
    { name: 'Términos y Condiciones', href: '/terminos' },
    { name: 'Política de Privacidad', href: '/privacidad' },
  ]

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/ayamasseguros', icon: <Facebook className="w-5 h-5" /> },
    { name: 'Instagram', href: 'https://instagram.com/ayamasseguros', icon: <Instagram className="w-5 h-5" /> },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/ayamasseguros', icon: <Linkedin className="w-5 h-5" /> },
    { name: 'YouTube', href: 'https://youtube.com/ayamasseguros', icon: <Youtube className="w-5 h-5" /> },
  ]

  return (
    <footer className="bg-neutral-800 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                <Shield size={20} />
              </div>
              <span className="text-2xl font-bold">A&A+ Seguros</span>
            </Link>

            <p className="text-neutral-300 mb-6 leading-relaxed">
              Más de 25 años protegiendo lo que más valoras. Tu seguridad es nuestra prioridad
              y trabajamos cada día para brindarte la mejor protección del mercado.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-neutral-300">600 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-neutral-300">contacto@segurosayamas.cl</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-neutral-300">La Serena,Chile</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-neutral-300">Lun - Vie: 8:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-500">Productos</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-500">Empresa</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-500">Soporte</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-neutral-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Mantente Informado</h3>
              <p className="text-neutral-300">
                Recibe consejos de seguridad, noticias del sector y ofertas especiales
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button className="btn btn-primary px-6 py-3 whitespace-nowrap">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-12 pt-8 border-t border-neutral-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-6">Certificaciones y Respaldos</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-primary-500 font-bold text-sm">CMF</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Comisión para el</div>
                  <div className="text-neutral-300">Mercado Financiero</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-primary-500 font-bold text-sm">AAA</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Calificación</div>
                  <div className="text-neutral-300">de Riesgo</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-primary-500 font-bold text-sm">ISO</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">ISO 9001</div>
                  <div className="text-neutral-300">Certificado</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-neutral-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-neutral-400 text-sm">
              © {currentYear} A&A+ Seguros. Todos los derechos reservados.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-neutral-400 text-sm">Síguenos:</span>
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/terminos" className="text-neutral-400 hover:text-white transition-colors">
                Términos
              </Link>
              <span className="text-neutral-600">|</span>
              <Link href="/privacidad" className="text-neutral-400 hover:text-white transition-colors">
                Privacidad
              </Link>
              <span className="text-neutral-600">|</span>
              <Link href="/cookies" className="text-neutral-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
