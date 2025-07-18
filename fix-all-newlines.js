#!/usr/bin/env node

/**
 * Script maestro para corregir todos los problemas de salto de línea en el proyecto ayamas
 * Ejecuta múltiples correcciones de manera secuencial
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 CORRECTOR MAESTRO DE SALTOS DE LÍNEA - PROYECTO AYAMAS')
console.log('='.repeat(60))
console.log(
  'Este script corregirá automáticamente los problemas de 
 literal'
)
console.log('encontrados en los archivos del proyecto.\n')

/**
 * Función para ejecutar un comando y capturar su salida
 */
function executeScript(scriptPath, description) {
  return new Promise((resolve, reject) => {
    console.log(`
🔧 ${description}...`)
    console.log(`   Ejecutando: node ${scriptPath}`)

    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: process.cwd(),
    })

    child.on('close', code => {
      if (code === 0) {
        console.log(`✅ ${description} completado exitosamente`)
        resolve()
      } else {
        console.error(`❌ Error en ${description} (código: ${code})`)
        reject(new Error(`Script failed with code ${code}`))
      }
    })

    child.on('error', error => {
      console.error(`❌ Error ejecutando ${description}:`, error.message)
      reject(error)
    })
  })
}

/**
 * Función para verificar que los scripts existen
 */
function checkScripts() {
  const scripts = ['fix-newlines.js', 'fix-specific-newlines.js']

  const missing = scripts.filter(script => !fs.existsSync(script))

  if (missing.length > 0) {
    console.error('❌ Scripts faltantes:')
    missing.forEach(script => console.error(`   - ${script}`))
    process.exit(1)
  }

  console.log('✅ Todos los scripts de corrección están disponibles')
}

/**
 * Función principal
 */
async function main() {
  try {
    // Verificar que los scripts existen
    checkScripts()

    console.log('\n📂 Directorio de trabajo:', process.cwd())
    console.log('⏰ Iniciando proceso de corrección...')

    // Paso 1: Ejecutar corrección general
    await executeScript(
      'fix-newlines.js',
      'Corrección general de saltos de línea'
    )

    // Paso 2: Ejecutar corrección específica para archivos JS/TS
    await executeScript(
      'fix-specific-newlines.js',
      'Corrección específica para archivos JavaScript/TypeScript'
    )

    // Paso 3: Verificar archivos corregidos
    console.log('\n🔍 Verificando archivos corregidos...')
    const backupFiles = fs
      .readdirSync('.')
      .filter(file => file.endsWith('.backup'))

    if (backupFiles.length > 0) {
      console.log(`💾 Se crearon ${backupFiles.length} archivos de backup:`)
      backupFiles.forEach(file => console.log(`   - ${file}`))

      console.log('\n📝 Para revisar los cambios realizados:')
      backupFiles.forEach(backup => {
        const original = backup.replace('.backup', '')
        console.log(`   diff "${backup}" "${original}"`)
      })

      console.log('\n🗑️  Para eliminar los backups después de verificar:')
      console.log('   find . -name "*.backup" -delete')
    }

    // Mostrar resumen final
    console.log('\n' + '='.repeat(60))
    console.log('🎉 CORRECCIÓN COMPLETADA EXITOSAMENTE')
    console.log('='.repeat(60))

    console.log('\n📋 Resumen de acciones realizadas:')
    console.log('   ✅ Corrección general de saltos de línea ejecutada')
    console.log(
      '   ✅ Corrección específica de JavaScript/TypeScript ejecutada'
    )
    console.log(`   ✅ ${backupFiles.length} archivos de backup creados`)

    console.log('\n🔄 Próximos pasos recomendados:')
    console.log(
      '   1. Revisar que los archivos se vean correctamente en tu editor'
    )
    console.log('   2. Probar que la aplicación funcione sin errores:')
    console.log('      npm run dev')
    console.log('   3. Ejecutar las migraciones si es necesario:')
    console.log('      npm run migrate:categories')
    console.log('   4. Si todo funciona bien, eliminar archivos .backup')
    console.log('   5. Hacer commit de los cambios')

    console.log('\n🎯 ¡Los problemas de salto de línea han sido corregidos!')
  } catch (error) {
    console.error('\n❌ Error durante el proceso de corrección:', error.message)
    console.log('\n🔄 Puedes intentar ejecutar los scripts individuales:')
    console.log('   node fix-newlines.js')
    console.log('   node fix-specific-newlines.js')
    process.exit(1)
  }
}

// Ejecutar script principal
if (require.main === module) {
  main()
}

module.exports = { main }
