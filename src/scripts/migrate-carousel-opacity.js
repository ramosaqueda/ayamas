/**
 * Script de migración para agregar el campo backgroundOpacity a slides existentes
 * Este script debe ejecutarse una vez para actualizar todos los slides del carrusel
 */

const { MongoClient } = require('mongodb')

// Configuración de la base de datos
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ayamas'
const DATABASE_NAME = process.env.DB_NAME || 'ayamas'

async function migrateCarouselOpacity() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log('🔄 Conectando a la base de datos...')
    await client.connect()
    
    const db = client.db(DATABASE_NAME)
    const collection = db.collection('carouselslides')

    // Buscar todos los slides que no tienen el campo backgroundOpacity
    const slidesWithoutOpacity = await collection.find({
      backgroundOpacity: { $exists: false }
    }).toArray()

    console.log(`📊 Encontrados ${slidesWithoutOpacity.length} slides para actualizar`)

    if (slidesWithoutOpacity.length === 0) {
      console.log('✅ No hay slides para migrar. Todos ya tienen el campo backgroundOpacity.')
      return
    }

    // Actualizar todos los slides sin backgroundOpacity
    const result = await collection.updateMany(
      { backgroundOpacity: { $exists: false } },
      { 
        $set: { 
          backgroundOpacity: 0.2  // Valor por defecto del 20%
        } 
      }
    )

    console.log(`✅ Migración completada:`)
    console.log(`   - Slides actualizados: ${result.modifiedCount}`)
    console.log(`   - Slides que coincidieron: ${result.matchedCount}`)

    // Verificar que la migración fue exitosa
    const remainingSlides = await collection.countDocuments({
      backgroundOpacity: { $exists: false }
    })

    if (remainingSlides === 0) {
      console.log('🎉 ¡Migración exitosa! Todos los slides ahora tienen el campo backgroundOpacity.')
    } else {
      console.log(`⚠️  Advertencia: Aún quedan ${remainingSlides} slides sin migrar.`)
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('🔌 Conexión cerrada')
  }
}

// Ejecutar la migración
if (require.main === module) {
  migrateCarouselOpacity()
    .then(() => {
      console.log('✨ Script de migración finalizado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error)
      process.exit(1)
    })
}

module.exports = { migrateCarouselOpacity }
