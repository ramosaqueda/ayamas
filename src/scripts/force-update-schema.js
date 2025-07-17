/**
 * Script para forzar la actualización del esquema y añadir backgroundOpacity
 * Este script bypassa el modelo de Mongoose y actualiza directamente MongoDB
 */

const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ayamas'
const DATABASE_NAME = process.env.DB_NAME || 'ayamas'

async function forceUpdateSchema() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log('🔄 Conectando directamente a MongoDB...')
    await client.connect()
    
    const db = client.db(DATABASE_NAME)
    const collection = db.collection('carouselslides')

    // Obtener todos los documentos actuales
    console.log('📋 Obteniendo slides actuales...')
    const slides = await collection.find({}).toArray()
    console.log(`📊 Encontrados ${slides.length} slides`)

    if (slides.length === 0) {
      console.log('ℹ️  No hay slides para actualizar')
      return
    }

    // Mostrar estado actual
    for (const slide of slides) {
      console.log(`📄 Slide: "${slide.title}"`)
      console.log(`   - ID: ${slide._id}`)
      console.log(`   - backgroundOpacity: ${slide.backgroundOpacity !== undefined ? slide.backgroundOpacity : 'NO DEFINIDO'}`)
      console.log(`   - backgroundImage: ${slide.backgroundImage || 'No tiene'}`)
    }

    // Actualizar TODOS los slides para asegurar que tengan backgroundOpacity
    console.log('\n🔧 Actualizando todos los slides...')
    
    const bulkOps = slides.map(slide => ({
      updateOne: {
        filter: { _id: slide._id },
        update: { 
          $set: { 
            backgroundOpacity: slide.backgroundOpacity !== undefined ? slide.backgroundOpacity : 0.2 
          } 
        }
      }
    }))

    const result = await collection.bulkWrite(bulkOps)
    console.log(`✅ Operación completada:`)
    console.log(`   - Documentos que coincidieron: ${result.matchedCount}`)
    console.log(`   - Documentos modificados: ${result.modifiedCount}`)

    // Verificar resultados
    console.log('\n🔍 Verificando resultados...')
    const updatedSlides = await collection.find({}).toArray()
    
    for (const slide of updatedSlides) {
      console.log(`✓ Slide: "${slide.title}"`)
      console.log(`   - backgroundOpacity: ${slide.backgroundOpacity}`)
    }

    // Verificar que todos tengan el campo
    const slidesWithoutOpacity = await collection.find({
      backgroundOpacity: { $exists: false }
    }).toArray()

    if (slidesWithoutOpacity.length === 0) {
      console.log('\n🎉 ¡Éxito! Todos los slides ahora tienen backgroundOpacity')
    } else {
      console.log(`\n⚠️  Advertencia: ${slidesWithoutOpacity.length} slides aún no tienen backgroundOpacity`)
    }

  } catch (error) {
    console.error('❌ Error durante la actualización forzada:', error)
  } finally {
    await client.close()
    console.log('🔌 Conexión cerrada')
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  forceUpdateSchema()
    .then(() => {
      console.log('✨ Script completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error)
      process.exit(1)
    })
}

module.exports = { forceUpdateSchema }
