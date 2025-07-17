import mongoose from 'mongoose'
import { Product, CarouselSlide, News } from '../src/lib/models'

// Datos iniciales para productos
const initialProducts = [
  {
    title: 'Seguros Personales',
    subtitle: 'Protección integral para ti y tu familia',
    description: 'Protege tu hogar y tu familia con nuestras coberturas personalizadas',
    price: 'Desde $30.000',
    period: '/mes',
    features: [
      'Seguros de Vida con inversión o ahorro',
      'Seguros de Vida de Protección y Salud',
      'Seguro Hogar Protegido (Incendio y Sismo, Robo)',
      'Seguro Automotriz (Daños Propios y Terceros, Robo)',
      'Seguro de Responsabilidad Civil',
    ],
    icon: 'person-standing',
    color: 'from-green-500 to-green-600',
    category: 'personal',
    popular: true,
    featured: true,
    active: true,
    order: 1
  },
  {
    title: 'Seguros Empresariales',
    subtitle: 'Soluciones integrales para tu negocio',
    description: 'Protege tu negocio con nuestras soluciones integrales',
    price: 'Desde $50.000',
    period: '/mes',
    features: [
      'Seguro de vehículos comerciales livianos',
      'Seguro de vehículos comerciales pesados',
      'Seguro de flota de vehículos',
      'Seguro de responsabilidad civil máxima',
      'Seguro de viajes específicos para empresas',
      'Seguro pólizas por proyectos',
    ],
    icon: 'building2',
    color: 'from-purple-500 to-purple-600',
    category: 'empresarial',
    popular: false,
    featured: true,
    active: true,
    order: 2
  },
  {
    title: 'Seguro de Colectivos',
    subtitle: 'Salud y bienestar para grupos',
    description: 'Cubre tus gastos médicos y hospitalarios con nuestra amplia red de clínicas',
    price: 'Desde $25.000',
    period: '/mes',
    features: [
      'Seguro complementario de salud y vida',
      'Seguros catastróficos',
      'Seguros de accidentes personales',
      'Seguros dentales',
      'Planes familiares disponibles'
    ],
    icon: 'stethoscope',
    color: 'from-orange-500 to-orange-600',
    category: 'salud',
    popular: false,
    featured: false,
    active: true,
    order: 3
  },
  {
    title: 'Seguros Especiales',
    subtitle: 'Coberturas únicas para necesidades específicas',
    description: 'Tenemos seguros para cada necesidad, desde viajes hasta eventos especiales',
    price: 'Desde $20.000',
    period: '/mes',
    features: [
      'Seguro agrícola',
      'Seguro casco marítimo',
      'Seguro yates',
      'Seguro garantía y crédito',
    ],
    icon: 'sailboat',
    color: 'from-teal-500 to-teal-600',
    category: 'especiales',
    popular: false,
    featured: false,
    active: true,
    order: 4
  },
  {
    title: 'Seguro Condominios',
    subtitle: 'Protección para comunidades',
    description: 'Maximizamos la seguridad de tu comunidad con nuestras pólizas de condominios',
    price: 'Desde $45.000',
    period: '/mes',
    features: [
      'Incendio, sismo y robo',
      'Responsabilidad civil',
      'Accidentes personales',
      'Riesgos de la naturaleza',
      'Rotura de cañerías',
      'Avería de maquinarias',
      'Rotura de cristales de áreas comunes',
      'Riesgos políticos y sociales',
      'Asistencias áreas comunes',
    ],
    icon: 'building',
    color: 'from-blue-500 to-blue-600',
    category: 'condominios',
    popular: true,
    featured: false,
    active: true,
    order: 5
  },
  {
    title: 'Seguros Obligatorios',
    subtitle: 'Cumple con la ley y protégete',
    description: 'La tranquilidad de cumplir con la ley y protegerte a ti y a los demás',
    price: 'Desde $15.000',
    period: '/mes',
    features: [
      'Seguro de vida conductores',
      'Seguros de responsabilidad civil internacional',
      'Seguros de viajes y asistencia al viajero',
      'Seguros de vigilantes y guardias',
      'Seguro de accidentes personales en viaje'
    ],
    icon: 'plane',
    color: 'from-red-500 to-red-600',
    category: 'obligatorios',
    popular: false,
    featured: false,
    active: true,
    order: 6
  }
]

// Datos iniciales para slides del carrusel
const initialCarouselSlides = [
  {
    title: 'Seguro de Vida Premium',
    subtitle: 'Protección Completa para tu Familia',
    description: 'El plan más completo con cobertura de vida, invalidez y enfermedades graves. Protege lo que más amas con la mejor cobertura del mercado.',
    price: '$45.000',
    originalPrice: '$60.000',
    period: '/mes',
    features: [
      'Cobertura hasta $200.000.000',
      'Sin período de carencia',
      'Asistencia médica 24/7',
      'Beneficios por hospitalización'
    ],
    icon: 'person-standing',
    backgroundColor: 'from-blue-600 to-blue-800',
    badge: '25% OFF',
    discount: '25% OFF',
    ctaText: 'Cotizar Ahora',
    ctaSecondary: 'Más Información',
    stats: { rating: 4.9, clients: '15K+' },
    active: true,
    order: 1
  },
  {
    title: 'Seguro Auto Total',
    subtitle: 'Protección Integral para tu Vehículo',
    description: 'Cobertura completa contra todo riesgo con la mejor atención en siniestros. Tu auto protegido las 24 horas del día.',
    price: '$38.000',
    period: '/mes',
    features: [
      'Todo riesgo franquicia 0',
      'Responsabilidad civil ilimitada',
      'Grúa y asistencia 24/7',
      'Auto de reemplazo incluido'
    ],
    icon: 'car',
    backgroundColor: 'from-red-600 to-red-800',
    badge: 'NUEVO',
    ctaText: 'Cotizar Auto',
    ctaSecondary: 'Ver Cobertura',
    stats: { rating: 4.8, clients: '25K+' },
    active: true,
    order: 2
  },
  {
    title: 'Seguro Hogar Completo',
    subtitle: 'Tu Hogar Siempre Protegido',
    description: 'Protección integral contra incendio, robo, sismos y más. La tranquilidad de saber que tu hogar está seguro.',
    price: '$28.000',
    period: '/mes',
    features: [
      'Incendio, sismo y robo',
      'Responsabilidad civil',
      'Gastos de habitación',
      'Jardinería incluida'
    ],
    icon: 'home',
    backgroundColor: 'from-green-600 to-green-800',
    ctaText: 'Proteger Hogar',
    ctaSecondary: 'Calcular Prima',
    stats: { rating: 4.7, clients: '20K+' },
    active: true,
    order: 3
  },
  {
    title: 'Seguro Empresarial',
    subtitle: 'Protege tu Negocio',
    description: 'Solución integral para empresas con cobertura de responsabilidad civil y protección patrimonial.',
    price: '$85.000',
    period: '/mes',
    features: [
      'Responsabilidad civil empresarial',
      'Protección de activos',
      'Interrupción de negocio',
      'Asesoría legal incluida'
    ],
    icon: 'building2',
    backgroundColor: 'from-purple-600 to-purple-800',
    ctaText: 'Cotizar Empresa',
    ctaSecondary: 'Asesoría Gratis',
    stats: { rating: 4.9, clients: '5K+' },
    active: true,
    order: 4
  },
  {
    title: 'Seguro de Salud',
    subtitle: 'Tu Salud es Nuestra Prioridad',
    description: 'Acceso a la mejor atención médica con amplia red de clínicas y hospitales en todo Chile.',
    price: '$45.000',
    period: '/mes',
    features: [
      'Red médica nacional',
      'Consultas ilimitadas',
      'Hospitalización completa',
      'Medicina preventiva'
    ],
    icon: 'stethoscope',
    backgroundColor: 'from-teal-600 to-teal-800',
    ctaText: 'Ver Planes',
    ctaSecondary: 'Red Médica',
    stats: { rating: 4.8, clients: '30K+' },
    active: true,
    order: 5
  }
]

// Datos iniciales para noticias
const initialNews = [
  {
    title: 'Nuevas Regulaciones de Seguros 2025',
    subtitle: 'Cambios importantes que debes conocer',
    description: 'La Superintendencia de Valores y Seguros ha anunciado nuevas regulaciones que entrarán en vigor este año, beneficiando a los asegurados con mayor protección y transparencia.',
    content: 'Contenido completo de la noticia sobre las nuevas regulaciones...',
    image: '/api/placeholder/600/400',
    author: 'María González',
    category: 'regulaciones',
    readTime: '5 min',
    featured: true,
    active: true,
    published: true,
    publishedAt: new Date('2025-01-15'),
    slug: 'nuevas-regulaciones-seguros-2025',
    tags: ['regulaciones', 'svs', '2025', 'cambios'],
    seoTitle: 'Nuevas Regulaciones de Seguros 2025 - Cambios Importantes',
    seoDescription: 'Conoce las nuevas regulaciones de seguros que entran en vigor en 2025 y cómo afectan a los asegurados.'
  },
  {
    title: 'Consejos para Elegir el Mejor Seguro de Vida',
    subtitle: 'Guía completa para tomar la mejor decisión',
    description: 'Conoce los factores clave que debes considerar al momento de contratar un seguro de vida y cómo elegir la cobertura que mejor se adapte a tus necesidades.',
    content: 'Contenido completo de la guía para elegir seguro de vida...',
    image: '/api/placeholder/600/400',
    author: 'Carlos Rodríguez',
    category: 'consejos',
    readTime: '8 min',
    featured: false,
    active: true,
    published: true,
    publishedAt: new Date('2025-01-10'),
    slug: 'consejos-elegir-seguro-vida',
    tags: ['consejos', 'seguro-vida', 'guía', 'cobertura'],
    seoTitle: 'Consejos para Elegir el Mejor Seguro de Vida - Guía 2025',
    seoDescription: 'Descubre cómo elegir el seguro de vida perfecto con nuestra guía completa de factores clave.'
  },
  {
    title: 'Tecnología e Innovación en Seguros',
    subtitle: 'El futuro de la industria aseguradora',
    description: 'Descubre cómo la inteligencia artificial y el análisis de datos están transformando la industria de seguros, mejorando la experiencia del cliente.',
    content: 'Contenido sobre tecnología en seguros...',
    image: '/api/placeholder/600/400',
    author: 'Ana Martínez',
    category: 'tecnologia',
    readTime: '6 min',
    featured: false,
    active: true,
    published: true,
    publishedAt: new Date('2025-01-05'),
    slug: 'tecnologia-innovacion-seguros',
    tags: ['tecnología', 'ia', 'innovación', 'futuro'],
    seoTitle: 'Tecnología e Innovación en la Industria de Seguros',
    seoDescription: 'Conoce cómo la IA y tecnología están revolucionando los seguros.'
  },
  {
    title: 'Récord de Satisfacción al Cliente',
    subtitle: 'A&A+ Seguros alcanza el 98% de satisfacción',
    description: 'Nuestra empresa ha alcanzado un récord histórico de satisfacción al cliente, consolidándose como líder en el mercado de seguros nacional.',
    content: 'Contenido sobre el récord de satisfacción...',
    image: '/api/placeholder/600/400',
    author: 'Equipo A&A+',
    category: 'empresa',
    readTime: '3 min',
    featured: true,
    active: true,
    published: true,
    publishedAt: new Date('2025-01-02'),
    slug: 'record-satisfaccion-cliente',
    tags: ['empresa', 'satisfacción', 'récord', 'clientes'],
    seoTitle: 'A&A+ Seguros Alcanza Récord de Satisfacción del 98%',
    seoDescription: 'Conoce cómo A&A+ Seguros logró un 98% de satisfacción al cliente en 2024.'
  }
]

// Función principal para poblar la base de datos
export async function seedDatabase() {
  try {
    // Conectar a MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está definida en las variables de entorno')
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Conectado a MongoDB')

    // Limpiar colecciones existentes
    console.log('🧹 Limpiando colecciones existentes...')
    await Product.deleteMany({})
    await CarouselSlide.deleteMany({})
    await News.deleteMany({})

    // Insertar productos
    console.log('📦 Insertando productos...')
    const products = await Product.insertMany(initialProducts)
    console.log(`✅ ${products.length} productos insertados`)

    // Insertar slides del carrusel
    console.log('🎠 Insertando slides del carrusel...')
    const slides = await CarouselSlide.insertMany(initialCarouselSlides)
    console.log(`✅ ${slides.length} slides insertados`)

    // Insertar noticias
    console.log('📰 Insertando noticias...')
    const news = await News.insertMany(initialNews)
    console.log(`✅ ${news.length} noticias insertadas`)

    console.log('\n🎉 ¡Base de datos poblada exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`   • Productos: ${products.length}`)
    console.log(`   • Slides del carrusel: ${slides.length}`)
    console.log(`   • Noticias: ${news.length}`)

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error)
    throw error
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Desconectado de MongoDB')
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n✨ Proceso completado exitosamente')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Error en el proceso:', error)
      process.exit(1)
    })
}
