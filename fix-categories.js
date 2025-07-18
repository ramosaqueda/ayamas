/**
 * Script para verificar y corregir productos con categorías string
 */

const { config } = require('dotenv')
const { join } = require('path')
const mongoose = require('mongoose')

// Cargar variables de entorno
config({ path: join(process.cwd(), '.env.local') })

// Conectar a MongoDB
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI no está definida en .env.local')
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    })
    console.log('✅ Conectado a MongoDB')
    return mongoose
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    throw error
  }
}

// Esquemas
const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  active: Boolean,
  order: Number
}, { timestamps: true })

const ProductSchema = new mongoose.Schema({
  title: String,
  category: mongoose.Schema.Types.Mixed, // Permitir string o ObjectId temporalmente
  description: String,
  price: String,
  features: [String],
  icon: String,
  color: String,
  popular: Boolean,
  featured: Boolean,
  active: Boolean,
  order: Number
}, { timestamps: true })

async function fixProductCategories() {
  console.log('🔍 Verificando y corrigiendo productos con categorías string...')
  
  try {
    await connectDB()
    
    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

    // Obtener mapeo de categorías
    const categories = await Category.find({})
    const categoryMap = new Map()
    
    categories.forEach(cat => {
      categoryMap.set(cat.slug, cat._id)
    })

    console.log('📋 Categorías disponibles:')
    categories.forEach(cat => {
      console.log(`   • ${cat.name} (${cat.slug}) -> ${cat._id}`)
    })

    // Encontrar productos con categorías string
    const productsWithStringCategories = await Product.find({
      category: { $type: 'string' }
    })

    console.log(`
🔍 Encontrados ${productsWithStringCategories.length} productos con categorías string:`)
    
    let fixedCount = 0
    let errorCount = 0

    for (const product of productsWithStringCategories) {
      const categorySlug = product.category
      const categoryId = categoryMap.get(categorySlug)
      
      if (categoryId) {
        await Product.findByIdAndUpdate(product._id, {
          category: categoryId
        })
        console.log(`   ✅ Corregido: ${product.title} (${categorySlug} -> ${categoryId})`)
        fixedCount++
      } else {
        console.log(`   ❌ Sin categoría: ${product.title} (${categorySlug})`)
        errorCount++
      }
    }

    // Verificar todos los productos
    console.log('
🔍 Verificación final:')
    const totalProducts = await Product.countDocuments()
    const productsWithObjectId = await Product.countDocuments({
      category: { $type: 'objectId' }
    })
    const productsWithString = await Product.countDocuments({
      category: { $type: 'string' }
    })

    console.log(`   Total productos: ${totalProducts}`)
    console.log(`   Con ObjectId: ${productsWithObjectId}`)
    console.log(`   Con string: ${productsWithString}`)
    console.log(`   Corregidos: ${fixedCount}`)
    console.log(`   Errores: ${errorCount}`)

    if (productsWithString === 0) {
      console.log('
🎉 ¡Todos los productos tienen categorías ObjectId!')
    } else {
      console.log('
⚠️  Aún hay productos con categorías string')
    }

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Conexión cerrada')
  }
}

// Ejecutar script
if (require.main === module) {
  fixProductCategories()
    .then(() => {
      console.log('
✅ Verificación completada')
      process.exit(0)
    })
    .catch((error) => {
      console.error('
❌ Error:', error.message)
      process.exit(1)
    })
}

module.exports = { fixProductCategories }
