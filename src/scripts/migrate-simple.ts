/**
 * Script de migración simplificado
 * Ejecuta la migración usando las variables de entorno de Next.js
 */

import { config } from 'dotenv'
import { join } from 'path'

// Cargar variables de entorno
config({ path: join(process.cwd(), '.env.local') })

// Importar después de cargar las variables
import { connectDB } from '../lib/mongodb'
import Category from '../lib/models/Category'
import Product from '../lib/models/Product'

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
  
  // Verificar MongoDB URI
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está definida')
    console.log('   Verifica que existe .env.local con MONGODB_URI configurada')
    process.exit(1)
  }
  
  console.log('📡 Conectando a MongoDB...')
  
  try {
    await connectDB()
    console.log('✅ Conectado a MongoDB exitosamente')

    // Crear categorías
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

    // Migrar productos
    console.log('\n📦 Migrando productos...')
    const products = await Product.find({})
    console.log(`   Encontrados ${products.length} productos`)

    let migratedCount = 0
    let skippedCount = 0

    for (const product of products) {
      const categorySlug = product.category as string
      
      // Verificar si ya es ObjectId
      if (typeof categorySlug === 'object' || categorySlug.toString().length === 24) {
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

    // Verificar resultados
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
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateCategories()
    .then(() => {
      console.log('\n✅ Migración completada')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error:', error.message)
      process.exit(1)
    })
}

export { migrateCategories }
