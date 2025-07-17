#!/usr/bin/env node

/**
 * Script de verificación pre-migración
 * Verifica que todo esté configurado correctamente antes de ejecutar la migración
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Verificando configuración pre-migración...\n')

const checks = [
  {
    name: 'Archivo de migración',
    check: () => fs.existsSync(path.join(__dirname, 'src', 'scripts', 'migrate-categories.ts')),
    message: 'Script de migración encontrado'
  },
  {
    name: 'Modelos de Category',
    check: () => fs.existsSync(path.join(__dirname, 'src', 'lib', 'models', 'Category.ts')),
    message: 'Modelo Category encontrado'
  },
  {
    name: 'Modelo Product actualizado',
    check: () => {
      const productPath = path.join(__dirname, 'src', 'lib', 'models', 'Product.ts')
      if (!fs.existsSync(productPath)) return false
      
      const content = fs.readFileSync(productPath, 'utf8')
      return content.includes('PopulatedDoc<ICategory>') || content.includes('ref: \'Category\'')
    },
    message: 'Modelo Product actualizado para usar referencias'
  },
  {
    name: 'API de categorías',
    check: () => fs.existsSync(path.join(__dirname, 'src', 'app', 'api', 'categories', 'route.ts')),
    message: 'API de categorías encontrada'
  },
  {
    name: 'Archivo de configuración MongoDB',
    check: () => fs.existsSync(path.join(__dirname, 'src', 'lib', 'mongodb', 'connection.ts')),
    message: 'Conexión MongoDB configurada'
  },
  {
    name: 'Variable de entorno MONGODB_URI',
    check: () => {
      const envPath = path.join(__dirname, '.env.local')
      if (!fs.existsSync(envPath)) return false
      
      const content = fs.readFileSync(envPath, 'utf8')
      return content.includes('MONGODB_URI=')
    },
    message: 'Variable MONGODB_URI configurada'
  }
]

let allPassed = true

checks.forEach(({ name, check, message }) => {
  const passed = check()
  const status = passed ? '✅' : '❌'
  console.log(`${status} ${name}: ${passed ? message : 'FALTANTE'}`)
  
  if (!passed) {
    allPassed = false
  }
})

console.log('\n' + '='.repeat(50))

if (allPassed) {
  console.log('🎉 ¡Todas las verificaciones pasaron!')
  console.log('\n📝 Puedes ejecutar la migración con:')
  console.log('   npm run migrate:categories')
  console.log('\n🔄 O si necesitas revertir:')
  console.log('   npm run migrate:categories:rollback')
  console.log('\n🌐 O usa la interfaz web:')
  console.log('   Visita http://localhost:3000/admin/migration')
} else {
  console.log('⚠️  Algunas verificaciones fallaron')
  console.log('Por favor, revisa los elementos marcados como FALTANTE')
  console.log('y asegúrate de que todos los archivos estén en su lugar.')
}

console.log('\n' + '='.repeat(50))
