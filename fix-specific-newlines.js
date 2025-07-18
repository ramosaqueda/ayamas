#!/usr/bin/env node

/**
 * Script específico para corregir problemas de escape en strings de JavaScript/TypeScript
 * Corrige casos donde 
 aparece literalmente en lugar de como salto de línea
 */

const fs = require('fs')
const path = require('path')

/**
 * Funciones específicas para corregir problemas de escape en código
 */
function fixJavaScriptEscapes(content) {
  let fixed = content
  let changes = []

  // Patrón para encontrar strings que contienen 
 literal donde debería ser salto de línea
  // Busca patrones como: "texto
mas texto" que deberían ser "texto
mas texto"
  const patterns = [
    {
      name: 'Strings con 
 literal',
      regex: /(['"`])([^'"`]*?)\\
([^'"`]*?)\1/g,
      replacement: '$1$2
$3$1',
    },
    {
      name: 'Strings con \\t literal',
      regex: /(['"`])([^'"`]*?)\\\\t([^'"`]*?)\1/g,
      replacement: '$1$2	$3$1',
    },
    {
      name: 'console.log con 
 literal',
      regex:
        /console\.(log|error|warn|info)\s*\(\s*['"`]([^'"`]*?)\\
([^'"`]*?)['"`]\s*\)/g,
      replacement: 'console.$1(`$2
$3`)',
    },
  ]

  patterns.forEach(pattern => {
    const matches = content.match(pattern.regex)
    if (matches && matches.length > 0) {
      fixed = fixed.replace(pattern.regex, pattern.replacement)
      changes.push(`${pattern.name}: ${matches.length} correcciones`)
    }
  })

  return { content: fixed, changes }
}

/**
 * Función para corregir problemas específicos en archivos de migración
 */
function fixMigrationScripts(content, filename) {
  let fixed = content
  let changes = []

  // Corregir console.log específicos que podrían tener problemas
  const consoleLogs = content.match(/console\.log\([^)]*
[^)]*\)/g)
  if (consoleLogs) {
    consoleLogs.forEach(log => {
      const fixedLog = log.replace(/\\n/g, '
')
      if (fixedLog !== log) {
        fixed = fixed.replace(log, fixedLog)
        changes.push('Corregido console.log con 
 literal')
      }
    })
  }

  // Corregir strings de error que podrían tener saltos de línea literales
  const errorStrings = content.match(/Error\([^)]*\\n[^)]*\)/g)
  if (errorStrings) {
    errorStrings.forEach(errorStr => {
      const fixedError = errorStr.replace(/\\n/g, '
')
      if (fixedError !== errorStr) {
        fixed = fixed.replace(errorStr, fixedError)
        changes.push('Corregido Error string con 
 literal')
      }
    })
  }

  return { content: fixed, changes }
}

/**
 * Función principal
 */
async function fixSpecificFiles() {
  console.log('🔧 Corrección específica de archivos JavaScript/TypeScript...
')

  const projectRoot = process.cwd()

  // Archivos específicos que sabemos que existen
  const specificFiles = [
    'fix-categories.js',
    'migrate-direct.js',
    'run-migration.js',
    'verify-migration.js',
    'src/scripts/migrate-categories.ts',
    'src/scripts/migrate-simple.ts',
  ]

  const results = []

  for (const relativePath of specificFiles) {
    const fullPath = path.join(projectRoot, relativePath)

    if (fs.existsSync(fullPath)) {
      try {
        console.log(`
🔍 Procesando: ${relativePath}`)

        const originalContent = fs.readFileSync(fullPath, 'utf8')

        // Crear backup
        const backupPath = fullPath + '.backup'
        fs.writeFileSync(backupPath, originalContent)
        console.log(`   💾 Backup creado`)

        // Aplicar correcciones generales
        let { content: fixedContent, changes: generalChanges } =
          fixJavaScriptEscapes(originalContent)

        // Aplicar correcciones específicas para archivos de migración
        if (
          relativePath.includes('migrate') ||
          relativePath.includes('fix-categories')
        ) {
          const { content: migrationFixed, changes: migrationChanges } =
            fixMigrationScripts(fixedContent, relativePath)
          fixedContent = migrationFixed
          generalChanges = generalChanges.concat(migrationChanges)
        }

        // Verificar si hubo cambios
        if (fixedContent !== originalContent) {
          fs.writeFileSync(fullPath, fixedContent)
          results.push({
            file: relativePath,
            changes: generalChanges,
            success: true,
          })

          console.log(`   ✅ Archivo corregido`)
          generalChanges.forEach(change => {
            console.log(`      - ${change}`)
          })
        } else {
          // Eliminar backup si no hubo cambios
          fs.unlinkSync(backupPath)
          console.log(`   ℹ️  No se necesitaron correcciones`)
          results.push({
            file: relativePath,
            changes: [],
            success: true,
          })
        }
      } catch (error) {
        console.error(`   ❌ Error procesando archivo: ${error.message}`)
        results.push({
          file: relativePath,
          changes: [],
          success: false,
          error: error.message,
        })
      }
    } else {
      console.log(`
⚠️  Archivo no encontrado: ${relativePath}`)
    }
  }

  // Resumen
  console.log('
' + '='.repeat(50))
  console.log('📊 RESUMEN DE CORRECCIONES ESPECÍFICAS')
  console.log('='.repeat(50))

  const successfulFixes = results.filter(r => r.success && r.changes.length > 0)
  const noChangesNeeded = results.filter(
    r => r.success && r.changes.length === 0
  )
  const errors = results.filter(r => !r.success)

  console.log(`
✅ Archivos corregidos: ${successfulFixes.length}`)
  console.log(`ℹ️  Archivos sin cambios: ${noChangesNeeded.length}`)
  console.log(`❌ Errores: ${errors.length}`)

  if (successfulFixes.length > 0) {
    console.log('
🎉 Correcciones aplicadas:')
    successfulFixes.forEach(result => {
      console.log(`
• ${result.file}`)
      result.changes.forEach(change => {
        console.log(`  - ${change}`)
      })
    })
  }

  if (errors.length > 0) {
    console.log('
❌ Errores encontrados:')
    errors.forEach(result => {
      console.log(`• ${result.file}: ${result.error}`)
    })
  }

  console.log('
🔧 Corrección específica completada')
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixSpecificFiles().catch(error => {
    console.error('❌ Error durante la ejecución:', error)
    process.exit(1)
  })
}

module.exports = { fixSpecificFiles, fixJavaScriptEscapes, fixMigrationScripts }
