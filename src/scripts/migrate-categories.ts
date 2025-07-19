/**
 * Script de migración para convertir las categorías de productos
 * de strings hardcodeados a referencias de la nueva colección Categories
 */

// Cargar variables de entorno desde .env.local
require('dotenv').config({ path: '.env.local' })

import { connectDB } from '@/lib/mongodb'
import Category from '@/lib/models/Category'
import Product from '@/lib/models/Product'

// Categorías legacy que estaban hardcodeadas
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
  
  // Verificar que la variable de entorno esté disponible
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está definida en .env.local')
    console.log('   Asegúrate de que existe el archivo .env.local con:')
    console.log('   MONGODB_URI=mongodb+srv://...')
    process.exit(1)
  }
  
  try {
    // Conectar a MongoDB
    await connectDB()
    console.log('✅ Conectado a MongoDB')

    // Paso 1: Crear las categorías en la nueva colección
    console.log('\n📝 Paso 1: Creando categorías en la nueva colección')
    const categoryMap = new Map()
    
    for (const categoryData of LEGACY_CATEGORIES) {
      // Verificar si ya existe
      let category = await Category.findOne({ slug: categoryData.slug })
      
      if (!category) {
        // Crear nueva categoría
        category = new Category({
          name: categoryData.name,
          slug: categoryData.slug,
          order: categoryData.order,
          active: true
        })
        await category.save()
        console.log(`   ✅ Creada categoría: ${categoryData.name}`)
      } else {
        console.log(`   ⚠️  Categoría ya existe: ${categoryData.name}`)
      }
      
      // Guardar mapeo para usar en productos
      categoryMap.set(categoryData.slug, category._id)
    }

    // Paso 2: Obtener todos los productos con categorías legacy
    console.log('\n📦 Paso 2: Actualizando productos existentes')
    const products = await Product.find({})
    console.log(`   Encontrados ${products.length} productos`)

    let migratedCount = 0
    let skippedCount = 0

    for (const product of products) {
      const categorySlug = product.category?.toString() || ''
      
      // Verificar si ya es un ObjectId (ya migrado)
      if (typeof categorySlug === 'object' || categorySlug.toString().length === 24) {
        skippedCount++
        continue
      }
      
      // Buscar el ID de la nueva categoría
      const categoryId = categoryMap.get(categorySlug)
      
      if (categoryId) {
        // Actualizar producto con la nueva referencia
        await Product.findByIdAndUpdate(product._id, {
          category: categoryId
        })
        console.log(`   ✅ Migrado producto: ${product.title} (${categorySlug} -> ${categoryId})`)
        migratedCount++
      } else {
        console.log(`   ⚠️  Categoría no encontrada para producto: ${product.title} (${categorySlug})`)
      }
    }

    // Paso 3: Verificar integridad de datos
    console.log('\n🔍 Paso 3: Verificando integridad de datos')
    const totalProducts = await Product.countDocuments()
    const productsWithCategories = await Product.countDocuments({
      category: { $exists: true, $ne: null }
    })
    
    console.log(`   Total productos: ${totalProducts}`)
    console.log(`   Productos con categorías: ${productsWithCategories}`)
    console.log(`   Productos migrados: ${migratedCount}`)
    console.log(`   Productos omitidos: ${skippedCount}`)

    // Verificar que todos los productos tienen referencias válidas
    const productsWithValidCategories = await Product.aggregate([
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

    const validCategoryCount = productsWithValidCategories[0]?.validCount || 0
    
    console.log(`   Productos con categorías válidas: ${validCategoryCount}`)

    if (validCategoryCount === totalProducts) {
      console.log('\n🎉 ¡Migración completada exitosamente!')
      console.log('   ✅ Todos los productos tienen categorías válidas')
    } else {
      console.log('\n⚠️  Migración completada con advertencias')
      console.log(`   ${totalProducts - validCategoryCount} productos pueden tener problemas de categoría`)
    }

    // Mostrar resumen final
    console.log('\n📊 Resumen de la migración:')
    console.log(`   • ${LEGACY_CATEGORIES.length} categorías creadas/verificadas`)
    console.log(`   • ${migratedCount} productos migrados`)
    console.log(`   • ${skippedCount} productos omitidos (ya migrados)`)
    console.log(`   • ${validCategoryCount}/${totalProducts} productos con categorías válidas`)

  } catch (error: unknown) {
    console.error('❌ Error durante la migración:', error)
    throw error
  }
}

// Función para revertir la migración (rollback)
async function rollbackMigration() {
  console.log('🔄 Iniciando rollback de migración...')
  
  // Verificar que la variable de entorno esté disponible
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está definida en .env.local')
    process.exit(1)
  }
  
  try {
    await connectDB()
    console.log('✅ Conectado a MongoDB')

    // Obtener mapeo de categorías
    const categories = await Category.find({})
    const categoryMap = new Map()
    
    categories.forEach(cat => {
      categoryMap.set(cat._id.toString(), cat.slug)
    })

    // Revertir productos a usar slugs
    const products = await Product.find({}).populate('category')
    let revertedCount = 0

    for (const product of products) {
      if (product.category && typeof product.category === 'object') {
        const categorySlug = (product.category as any).slug
        if (categorySlug) {
          await Product.findByIdAndUpdate(product._id, {
            category: categorySlug
          })
          console.log(`   ✅ Revertido producto: ${product.title} (${categorySlug})`)
          revertedCount++
        }
      }
    }

    console.log(`
🎉 Rollback completado: ${revertedCount} productos revertidos`)
    
  } catch (error: unknown) {
    console.error('❌ Error durante el rollback:', error)
    throw error
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.includes('--rollback')) {
    rollbackMigration()
      .then(() => process.exit(0))
      .catch(() => process.exit(1))
  } else {
    migrateCategories()
      .then(() => process.exit(0))
      .catch(() => process.exit(1))
  }
}

export { migrateCategories, rollbackMigration }
