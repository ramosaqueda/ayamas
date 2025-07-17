'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getIcon } from '@/lib/iconUtils'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import { ArrowLeft, Star, Check, Phone, Mail, MessageCircle } from 'lucide-react'
import { useProductDetail, useProducts, getCategoryName, getCategorySlug } from '@/hooks/useProductHooks'
import RelatedProducts from '@/components/ui/RelatedProducts'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { product, loading, error } = useProductDetail(params.id as string)
  const { products: allProducts } = useProducts()

  const handleQuoteRequest = () => {
    if (product) {
      router.push(`/cotizar?producto=${encodeURIComponent(product.title)}`)
    }
  }

  const handleWhatsApp = () => {
    if (product) {
      const message = `Hola, me interesa obtener más información sobre el seguro: ${product.title}`
      const whatsappUrl = `https://wa.me/50683547889?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleCall = () => {
    window.open('tel:+50683547889', '_self')
  }

  const handleEmail = () => {
    if (product) {
      const subject = `Consulta sobre ${product.title}`
      const body = `Estimados,\n\nMe interesa obtener más información sobre el seguro: ${product.title}\n\nGracias.`
      window.open(`mailto:info@ayamas.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" variant="spinner" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">
            {error || 'Producto no encontrado'}
          </h1>
          <Button onClick={() => router.back()} leftIcon={<ArrowLeft size={20} />}>
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header con navegación */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft size={20} />}
            className="mb-4"
          >
            Volver a productos
          </Button>
          {product && (
            <Breadcrumbs
              items={[
                { label: 'Productos', href: '/productos' },
                { label: getCategoryName(product.category), href: `/productos?categoria=${getCategorySlug(product.category)}` },
                { label: product.title, active: true }
              ]}
            />
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen del producto */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl shadow-ayamas-lg bg-white">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                  priority
                />
              ) : (
                <div className={`w-full h-80 bg-gradient-to-br ${product.color} flex items-center justify-center`}>
                  {getIcon(product.icon, "w-24 h-24 text-white")}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.popular && (
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    Popular
                  </span>
                )}
                {product.featured && (
                  <span className="bg-secondary-500 text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">
                    Destacado
                  </span>
                )}
                {product.badge && (
                  <span className="bg-neutral-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Descuento */}
              {product.discount && (
                <div className="absolute top-4 right-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.discount}
                  </span>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-xl p-6 shadow-ayamas">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                ¿Por qué elegir este seguro?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-600">Cobertura amplia y personalizable</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-600">Atención 24/7 los 365 días del año</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-600">Proceso de reclamos simplificado</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-600">Respaldo de compañías aseguradoras reconocidas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="space-y-6">
            {/* Header del producto */}
            <div className="bg-white rounded-xl p-8 shadow-ayamas">
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${product.color}`}>
                  {getIcon(product.icon, "w-8 h-8 text-white")}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                    {product.title}
                  </h1>
                  {product.subtitle && (
                    <p className="text-xl text-neutral-600 mb-4">
                      {product.subtitle}
                    </p>
                  )}
                  <span className="inline-block bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {getCategoryName(product.category)}
                  </span>
                </div>
              </div>

              {/* Precio */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  {product.originalPrice && product.originalPrice !== product.price && (
                    <span className="product-original-price">
                      ₡{product.originalPrice}
                    </span>
                  )}
                  <span className="product-price">
                    {product.price === "0" ? "Cotizar" : `₡${product.price}`}
                  </span>
                  {product.period && product.price !== "0" && (
                    <span className="text-lg text-neutral-600">
                      {product.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <p className="text-neutral-700 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Botones de acción */}
              <div className="grid grid-cols-1 gap-4">
                <Button
                  size="lg"
                  fullWidth
                  onClick={handleQuoteRequest}
                  className="text-lg font-semibold"
                >
                  Solicitar Cotización Gratuita
                </Button>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleWhatsApp}
                    leftIcon={<MessageCircle size={20} />}
                    className="text-sm"
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleCall}
                    leftIcon={<Phone size={20} />}
                    className="text-sm"
                  >
                    Llamar
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleEmail}
                    leftIcon={<Mail size={20} />}
                    className="text-sm"
                  >
                    Email
                  </Button>
                </div>
              </div>
            </div>

            {/* Características */}
            <div className="bg-white rounded-xl p-8 shadow-ayamas">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                Tipos de seguros
              </h2>
              <div className="space-y-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="product-feature-item">
                    <Check className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                ¿Necesitas más información?
              </h3>
              <p className="mb-6 opacity-90">
                Nuestros expertos están listos para asesorarte y crear una solución personalizada para tus necesidades.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>+506 8354-7889</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>info@ayamas.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {product && allProducts.length > 0 && (
        <RelatedProducts
          currentProduct={product}
          allProducts={allProducts}
          maxProducts={3}
        />
      )}
    </div>
  )
}
