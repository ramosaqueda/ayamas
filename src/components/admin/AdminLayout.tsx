'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ImageIcon, 
  Newspaper, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  User,
  Bell,
  Search
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/admin/dashboard'
    },
    {
      name: 'Productos',
      href: '/admin/products',
      icon: Package,
      current: pathname.startsWith('/admin/products')
    },
    {
      name: 'Carrusel',
      href: '/admin/carousel',
      icon: ImageIcon,
      current: pathname.startsWith('/admin/carousel')
    },
    {
      name: 'Noticias',
      href: '/admin/news',
      icon: Newspaper,
      current: pathname.startsWith('/admin/news')
    },
    {
      name: 'Configuración',
      href: '/admin/settings',
      icon: Settings,
      current: pathname.startsWith('/admin/settings')
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar para móvil */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
            <h1 className="text-xl font-bold text-primary-500">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col min-h-0 bg-white border-r border-neutral-200">
          <div className="flex items-center h-16 px-6 border-b border-neutral-200">
            <h1 className="text-xl font-bold text-primary-500">Admin Panel</h1>
          </div>
          <nav className="flex-1 mt-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* User section */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-700">Admin</p>
                <p className="text-xs text-neutral-500">admin@ayamasseguros.cl</p>
              </div>
            </div>
            <button className="mt-3 flex items-center w-full px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-neutral-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center flex-1 lg:ml-0">
              <div className="max-w-lg w-full lg:max-w-xs">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Buscar..."
                    type="search"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center ml-4 space-x-4">
              <button className="p-2 text-neutral-400 hover:text-neutral-500 rounded-full hover:bg-neutral-100">
                <Bell className="w-5 h-5" />
              </button>
              
              <Link
                href="/"
                className="text-sm text-neutral-600 hover:text-neutral-900 font-medium"
              >
                Ver Sitio
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
