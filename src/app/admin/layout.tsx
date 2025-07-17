import type { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'

export const metadata: Metadata = {
  title: 'Panel de Administración - A&A+ Seguros',
  description: 'Panel de administración para gestionar productos, carrusel y noticias',
  robots: 'noindex, nofollow', // No indexar el panel de admin
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
