#!/usr/bin/env node

/**
 * Script ejecutable para migrar categorías
 * Uso: node run-migration.js [--rollback]
 */

const { spawn } = require('child_process')
const path = require('path')

console.log('🚀 Iniciando proceso de migración de categorías...
')

// Determinar si es rollback
const isRollback = process.argv.includes('--rollback')
const command = isRollback ? 'rollback' : 'migrate'

console.log(`📝 Ejecutando: ${command}`)
console.log(`📂 Directorio: ${process.cwd()}`)

// Construir el comando
const scriptPath = path.join(__dirname, 'src', 'scripts', 'migrate-categories.ts')
const args = ['tsx', scriptPath]

if (isRollback) {
  args.push('--rollback')
}

console.log(`🔧 Comando: npx ${args.join(' ')}
`)

// Ejecutar el script
const child = spawn('npx', args, {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
})

child.on('close', (code) => {
  console.log(`
✅ Proceso completado con código: ${code}`)
  
  if (code === 0) {
    console.log('🎉 ¡Migración ejecutada exitosamente!')
    console.log('
📝 Próximos pasos:')
    console.log('   1. Verifica la aplicación en /admin/categories')
    console.log('   2. Prueba crear/editar productos')
    console.log('   3. Confirma que las categorías funcionan correctamente')
  } else {
    console.log('❌ Error durante la migración')
    console.log('
🔄 Si necesitas revertir, ejecuta:')
    console.log('   node run-migration.js --rollback')
  }
})

child.on('error', (error) => {
  console.error('❌ Error al ejecutar el script:', error)
  process.exit(1)
})
