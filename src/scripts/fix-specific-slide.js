/**
 * Script para actualizar un slide específico con el campo backgroundOpacity
 * Ejecutar con: node fix-specific-slide.js
 */

const { MongoClient, ObjectId } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ayamas'
const DATABASE_NAME = process.env.DB_NAME || 'ayamas'

// ID del slide que necesita ser actualizado
const SLIDE_ID = '6873e291a2c9caa06dbd7a79'

async function fixSpecificSlide() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log('🔄 Conectando a la base de datos...')
    await client.connect()
    
    const db = client.db(DATABASE_NAME)
    const collection = db.collection('carouselslides')

    // Verificar si el slide existe
    const slide = await collection.findOne({ _id: new ObjectId(SLIDE_ID) })
    
    if (!slide) {
      console.log(`❌ No se encontró el slide con ID: ${SLIDE_ID}`)
      return
    }

    console.log(`📋 Slide encontrado: "${slide.title}"`)
    
    if (slide.backgroundOpacity !== undefined) {
      console.log(`✅ El slide ya tiene backgroundOpacity: ${slide.backgroundOpacity}`)
      return
    }

    // Actualizar el slide específico
    const result = await collection.updateOne(
      { _id: new ObjectId(SLIDE_ID) },
      { 
        $set: { 
          backgroundOpacity: 0.2  // Valor por defecto del 20%
        } 
      }
    )

    if (result.modifiedCount > 0) {
      console.log(`✅ Slide actualizado exitosamente`)
      console.log(`   - backgroundOpacity: 0.2 (20%)`)
      
      // Verificar la actualización
      const updatedSlide = await collection.findOne({ _id: new ObjectId(SLIDE_ID) })
      console.log(`🔍 Verificación: backgroundOpacity = ${updatedSlide.backgroundOpacity}`)
    } else {
      console.log(`⚠️  No se pudo actualizar el slide`)
    }

  } catch (error) {
    console.error('❌ Error durante la actualización:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('🔌 Conexión cerrada')
  }
}

// Ejecutar la actualización
if (require.main === module) {
  fixSpecificSlide()
    .then(() => {
      console.log('✨ Script finalizado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error)
      process.exit(1)
    })
}

module.exports = { fixSpecificSlide }
