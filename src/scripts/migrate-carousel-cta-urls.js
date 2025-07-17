/**
 * Script de migración para agregar los nuevos campos ctaUrl y ctaSecondaryUrl
 * a los slides del carrusel existentes.
 * 
 * Ejecutar con: node src/scripts/migrate-carousel-cta-urls.js
 */

const mongoose = require('mongoose')

// Schema simplificado para la migración
const CarouselSlideSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  price: String,
  originalPrice: String,
  period: String,
  features: [String],
  icon: String,
  backgroundColor: String,
  backgroundImage: String,
  backgroundOpacity: Number,
  badge: String,
  discount: String,
  ctaText: String,
  ctaSecondary: String,
  ctaUrl: String,
  ctaSecondaryUrl: String,
  stats: {
    rating: Number,
    clients: String
  },
  active: Boolean,
  order: Number,
  href: String
}, {
  timestamps: true
})

const CarouselSlide = mongoose.model('CarouselSlide', CarouselSlideSchema)

async function migrateCarouselCTAUrls() {
  try {
    // Conectar a la base de datos
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ayamas'
    await mongoose.connect(mongoUri)
    console.log('✅ Conectado a MongoDB')

    // Buscar todos los slides
    const slides = await CarouselSlide.find({})
    console.log(`📋 Encontrados ${slides.length} slides para migrar`)

    let migrated = 0
    let skipped = 0

    for (const slide of slides) {
      let needsUpdate = false
      const updateData = {}

      // Si no tiene ctaUrl pero tiene href, usar href como ctaUrl
      if (!slide.ctaUrl && slide.href) {
        updateData.ctaUrl = slide.href
        needsUpdate = true
      }

      // Si no tiene ctaSecondaryUrl, dejar vacío (ya es undefined por defecto)
      if (!slide.ctaSecondaryUrl) {
        updateData.ctaSecondaryUrl = ''
        needsUpdate = true
      }

      // Hacer opcional el ctaSecondary si está vacío
      if (!slide.ctaSecondary || slide.ctaSecondary.trim() === 'Más Información') {
        updateData.ctaSecondary = ''
        needsUpdate = true
      }

      // Hacer opcionales los stats si tienen valores por defecto
      if (slide.stats) {
        if (slide.stats.rating === 4.8 && slide.stats.clients === '10K+') {
          // Si tiene valores por defecto, limpiarlos para hacer opcional
          updateData.stats = {
            rating: undefined,
            clients: ''
          }
          needsUpdate = true
        }
      }

      if (needsUpdate) {
        await CarouselSlide.findByIdAndUpdate(slide._id, updateData)
        migrated++
        console.log(`✅ Migrado slide: ${slide.title}`)
      } else {
        skipped++
        console.log(`⏭️  Saltado slide: ${slide.title} (ya migrado)`)
      }
    }

    console.log('\n🎉 Migración completada:')
    console.log(`   - Slides migrados: ${migrated}`)
    console.log(`   - Slides saltados: ${skipped}`)
    console.log(`   - Total procesados: ${slides.length}`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Desconectado de MongoDB')
    process.exit(0)
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateCarouselCTAUrls()
}

module.exports = { migrateCarouselCTAUrls }
