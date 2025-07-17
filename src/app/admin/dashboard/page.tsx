'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Package, 
  ImageIcon, 
  Newspaper, 
  Users, 
  TrendingUp, 
  Eye,
  Plus,
  Edit,
  BarChart3,
  Activity
} from 'lucide-react'

interface DashboardStats {
  products: { total: number, active: number, featured: number }
  carousel: { total: number, active: number }
  news: { total: number, published: number, featured: number }
  recentActivity: Array<{
    id: string
    type: 'product' | 'carousel' | 'news'
    action: 'created' | 'updated' | 'deleted'
    title: string
    time: string
  }>
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Obtener estadísticas de productos
      const productsRes = await fetch('/api/products')
      const productsData = await productsRes.json()
      
      // Obtener estadísticas del carrusel
      const carouselRes = await fetch('/api/carousel')
      const carouselData = await carouselRes.json()
      
      // Obtener estadísticas de noticias
      const newsRes = await fetch('/api/news')
      const newsData = await newsRes.json()
      
      const dashboardStats: DashboardStats = {
        products: {
          total: productsData.data?.length || 0,
          active: productsData.data?.filter((p: any) => p.active).length || 0,
          featured: productsData.data?.filter((p: any) => p.featured).length || 0
        },
        carousel: {
          total: carouselData.data?.length || 0,
          active: carouselData.data?.filter((s: any) => s.active).length || 0
        },
        news: {
          total: newsData.data?.length || 0,
          published: newsData.data?.filter((n: any) => n.published).length || 0,
          featured: newsData.data?.filter((n: any) => n.featured).length || 0
        },
        recentActivity: [
          {
            id: '1',
            type: 'product',
            action: 'updated',
            title: 'Seguro de Vida Premium',
            time: 'hace 2 horas'
          },
          {
            id: '2',
            type: 'carousel',
            action: 'created',
            title: 'Nuevo slide promocional',
            time: 'hace 4 horas'
          },
          {
            id: '3',
            type: 'news',
            action: 'updated',
            title: 'Nuevas regulaciones 2025',
            time: 'hace 1 día'
          }
        ]
      }
      
      setStats(dashboardStats)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Productos',
      total: stats?.products.total || 0,
      subtitle: `${stats?.products.active || 0} activos`,
      icon: Package,
      color: 'text-blue-600 bg-blue-100',
      href: '/admin/products'
    },
    {
      title: 'Carrusel',
      total: stats?.carousel.total || 0,
      subtitle: `${stats?.carousel.active || 0} activos`,
      icon: ImageIcon,
      color: 'text-green-600 bg-green-100',
      href: '/admin/carousel'
    },
    {
      title: 'Noticias',
      total: stats?.news.total || 0,
      subtitle: `${stats?.news.published || 0} publicadas`,
      icon: Newspaper,
      color: 'text-purple-600 bg-purple-100',
      href: '/admin/news'
    },
    {
      title: 'Total Items',
      total: (stats?.products.total || 0) + (stats?.carousel.total || 0) + (stats?.news.total || 0),
      subtitle: 'En el sistema',
      icon: BarChart3,
      color: 'text-orange-600 bg-orange-100',
      href: '/admin/dashboard'
    }
  ]

  const quickActions = [
    {
      title: 'Nuevo Producto',
      description: 'Agregar un nuevo producto de seguro',
      icon: Package,
      href: '/admin/products/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Nuevo Slide',
      description: 'Crear slide para el carrusel principal',
      icon: ImageIcon,
      href: '/admin/carousel/new',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Nueva Noticia',
      description: 'Escribir y publicar una noticia',
      icon: Newspaper,
      href: '/admin/news/new',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-2">
          Bienvenido al panel de administración de A&A+ Seguros
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">{card.title}</p>
                <p className="text-2xl font-bold text-neutral-900">{card.total}</p>
                <p className="text-xs text-neutral-500">{card.subtitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`flex items-center p-4 rounded-lg text-white transition-colors ${action.color}`}
              >
                <action.icon className="w-5 h-5 mr-3" />
                <div>
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
                <Plus className="w-4 h-4 ml-auto" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {stats?.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 rounded-lg bg-neutral-50">
                <div className="p-2 rounded-full bg-white">
                  {activity.type === 'product' && <Package className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'carousel' && <ImageIcon className="w-4 h-4 text-green-600" />}
                  {activity.type === 'news' && <Newspaper className="w-4 h-4 text-purple-600" />}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
                  <p className="text-xs text-neutral-500">
                    {activity.action === 'created' && 'Creado'}
                    {activity.action === 'updated' && 'Actualizado'}
                    {activity.action === 'deleted' && 'Eliminado'}
                    {' '}{activity.time}
                  </p>
                </div>
                <Edit className="w-4 h-4 text-neutral-400" />
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <Link
              href="/admin/activity"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver toda la actividad →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Enlaces Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/"
            className="flex items-center p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <Eye className="w-5 h-5 text-neutral-600 mr-2" />
            <span className="text-sm font-medium">Ver Sitio</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <Package className="w-5 h-5 text-neutral-600 mr-2" />
            <span className="text-sm font-medium">Gestionar Productos</span>
          </Link>
          <Link
            href="/admin/carousel"
            className="flex items-center p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-neutral-600 mr-2" />
            <span className="text-sm font-medium">Editar Carrusel</span>
          </Link>
          <Link
            href="/admin/news"
            className="flex items-center p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <Newspaper className="w-5 h-5 text-neutral-600 mr-2" />
            <span className="text-sm font-medium">Gestionar Noticias</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
