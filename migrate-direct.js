/**
 * Script de migración que ejecuta directamente desde la terminal
 * Usa require en lugar de import para evitar problemas de resolución
 */

const { config } = require('dotenv')
const { join } = require('path')
const mongoose = require('mongoose')

// Cargar variables de entorno
config({ path: join(process.cwd(), '.env.local') })

// Configurar conexión a MongoDB
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI no está definida en .env.local')
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose
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

// Esquema de Category
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Esquema de Product
const ProductSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  price: String,
  originalPrice: String,
  period: String,
  features: [String],
  icon: String,
  color: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  popular: Boolean,
  featured: Boolean,
  active: Boolean,
  order: Number,
  badge: String,
  discount: String,
  href: String,
  image: String
}, {
  timestamps: true
})

// Categorías legacy
const LEGACY_CATEGORIES = [
  { slug: 'personal', name: 'Personal', order: 1 },
  { slug: 'empresarial', name: 'Empresarial', order: 2 },
  { slug: 'salud', name: 'Salud', order: 3 },
  { slug: 'especiales', name: 'Especiales', order: 4 },
  { slug: 'obligatorios', name: 'Obligatorios', order: 5 },
  { slug: 'condominios', name: 'Condominios', order: 6 }
]

async function migrateCategories() {
  console.log('🚀 Iniciando migración de categorías...')
  
  try {
    // Conectar a MongoDB
    await connectDB()
    
    // Crear modelos
    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

    // Paso 1: Crear categorías
    console.log('\n📝 Creando categorías...')
    const categoryMap = new Map()
    
    for (const categoryData of LEGACY_CATEGORIES) {
      let category = await Category.findOne({ slug: categoryData.slug })
      
      if (!category) {
        category = new Category({
          name: categoryData.name,
          slug: categoryData.slug,
          order: categoryData.order,
          active: true
        })
        await category.save()
        console.log(`   ✅ Creada: ${categoryData.name}`)
      } else {
        console.log(`   ⚠️  Ya existe: ${categoryData.name}`)
      }
      
      categoryMap.set(categoryData.slug, category._id)
    }

    // Paso 2: Migrar productos
    console.log('\n📦 Migrando productos...')
    const products = await Product.find({})
    console.log(`   Encontrados ${products.length} productos`)

    let migratedCount = 0
    let skippedCount = 0

    for (const product of products) {
      const categorySlug = product.category
      
      // Verificar si ya es ObjectId
      if (typeof categorySlug === 'object' || 
          (typeof categorySlug === 'string' && categorySlug.length === 24 && mongoose.Types.ObjectId.isValid(categorySlug))) {
        skippedCount++
        continue
      }
      
      const categoryId = categoryMap.get(categorySlug)
      
      if (categoryId) {
        await Product.findByIdAndUpdate(product._id, {
          category: categoryId
        })
        console.log(`   ✅ ${product.title} (${categorySlug})`)
        migratedCount++
      } else {
        console.log(`   ⚠️  Sin categoría: ${product.title} (${categorySlug})`)
      }
    }

    // Paso 3: Verificar resultados
    console.log('\n🔍 Verificando migración...')
    const totalProducts = await Product.countDocuments()
    const productsWithCategories = await Product.countDocuments({
      category: { $exists: true, $ne: null }
    })
    
    console.log(`   Total productos: ${totalProducts}`)
    console.log(`   Con categorías: ${productsWithCategories}`)
    console.log(`   Migrados: ${migratedCount}`)
    console.log(`   Omitidos: ${skippedCount}`)

    // Verificar integridad
    const validProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      {
        $match: {
          'categoryData.0': { $exists: true }
        }
      },
      {
        $count: 'validCount'
      }
    ])

    const validCount = validProducts[0]?.validCount || 0
    
    console.log(`   Válidos: ${validCount}`)

    if (validCount === totalProducts) {
      console.log('\n🎉 ¡Migración completada exitosamente!')
      console.log('   ✅ Todos los productos tienen categorías válidas')
    } else {
      console.log('\n⚠️  Migración completada con advertencias')
      console.log(`   ${totalProducts - validCount} productos con problemas`)
    }

    console.log('\n📊 Resumen:')
    console.log(`   • ${LEGACY_CATEGORIES.length} categorías creadas`)
    console.log(`   • ${migratedCount} productos migrados`)
    console.log(`   • ${skippedCount} productos omitidos`)
    console.log(`   • ${validCount}/${totalProducts} productos válidos`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  } finally {
    // Cerrar conexión
    await mongoose.connection.close()
    console.log('🔌 Conexión cerrada')
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateCategories()
    .then(() => {
      console.log('\n✅ Migración completada exitosamente')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error:', error.message)
      process.exit(1)
    })
}

module.exports = { migrateCategories }
