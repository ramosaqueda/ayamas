#!/usr/bin/env node

/**
 * Script de verificación simple para problemas de salto de línea
 * Verifica que los scripts de corrección funcionen correctamente
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 VERIFICADOR DE SALTOS DE LÍNEA')
console.log('='.repeat(40))

function verifyFile(filePath) {
  console.log(`
Verificando: ${path.basename(filePath)}`)
  
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const issues = []
    
    // Verificar problemas específicos
    
    // 1. Strings includes vacíos
    if (content.includes("includes('')")) {
      issues.push('includes con strings vacíos')
    }
    
    // 2. Regex vacíos
    if (content.includes('match(//g)')) {
      issues.push('regex con patrones vacíos')
    }
    
    // 3. Console.log rotos
    if (content.match(/console\.log\([^)]*
[^)]*\)/)) {
      issues.push('console.log con saltos rotos')
    }
    
    // 4. Template strings rotos
    if (content.match(/`[^`]*
[^`]*`/)) {
      issues.push('template strings con saltos rotos')
    }
    
    // 5. Comentarios rotos
    if (content.includes('literal en lugar')) {
      issues.push('comentarios con texto cortado')
    }
    
    if (issues.length > 0) {
      console.log('  ❌ Problemas encontrados:')
      issues.forEach(issue => {
        console.log(`     - ${issue}`)
      })
      return false
    } else {
      console.log('  ✅ Archivo correcto')
      return true
    }
    
  } catch (error) {
    console.log(`  💥 Error leyendo archivo: ${error.message}`)
    return false
  }
}

// Verificar archivos principales
const filesToCheck = [
  'fix-newlines.js',
  'fix-specific-newlines.js', 
  'fix-all-newlines.js',
  'verify-newlines.js'
]

let correctFiles = 0
let totalFiles = 0

filesToCheck.forEach(file => {
  const fullPath = path.join(process.cwd(), file)
  if (fs.existsSync(fullPath)) {
    totalFiles++
    if (verifyFile(fullPath)) {
      correctFiles++
    }
  } else {
    console.log(`
⚠️  ${file} no encontrado`)
  }
})

console.log('
' + '='.repeat(40))
console.log('📊 RESULTADO DE VERIFICACIÓN')
console.log('='.repeat(40))
console.log(`
Archivos verificados: ${totalFiles}`)
console.log(`Archivos correctos: ${correctFiles}`)
console.log(`Archivos con problemas: ${totalFiles - correctFiles}`)

if (correctFiles === totalFiles) {
  console.log('
🎉 ¡Todos los archivos están correctos!')
  console.log('Puedes ejecutar con seguridad:')
  console.log('  npm run fix:newlines:all')
} else {
  console.log('
🔧 Algunos archivos necesitan corrección')
  console.log('Ejecuta primero:')
  console.log('  node fix-scripts.js')
}

console.log()
