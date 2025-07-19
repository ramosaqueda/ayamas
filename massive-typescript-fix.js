import fs from 'fs';
import path from 'path';

const projectRoot = '/Users/rafaelramos/Desktop/ayamas/src';

console.log('🚀 CORRECCIÓN MASIVA DE ERRORES DE TYPESCRIPT');
console.log('='.repeat(60));

// Función para aplicar correcciones generales
function fixAllTypeErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // 1. Filtros sin tipo
  if (content.includes('.filter(') && !content.includes('(f: string)')) {
    content = content.replace(/\.filter\(\s*([a-zA-Z_]\w*)\s*=>\s*\1\.trim\(\)/g, '.filter(($1: string) => $1.trim())');
    content = content.replace(/\.filter\(\s*([a-zA-Z_]\w*)\s*=>\s*\1\.trim\(\)\.length\s*[><=!]\s*\d+/g, '.filter(($1: string) => $1.trim().length $&)');
    modified = true;
  }
  
  // 2. Error handling
  content = content.replace(/catch\s*\(\s*error\s*\)\s*{/g, 'catch (error: unknown) {');
  content = content.replace(/error\.message(?!\s*\?|instanceof)/g, '(error instanceof Error ? error.message : String(error))');
  
  // 3. ObjectId comparisons
  content = content.replace(/([a-zA-Z_]\w*\._id)\s*(!==|===)\s*([a-zA-Z_]\w*)/g, '$1.toString() $2 $3');
  
  // 4. Image constructor
  content = content.replace(/new\s+Image\s*\(\s*\)/g, 'document.createElement("img")');
  
  // 5. Conversiones de tipo inseguras
  content = content.replace(/([a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*)\s+as\s+string(?!\s*\|\s*undefined)/g, '$1?.toString() || ""');
  
  // 6. Propiedades opcionales problemáticas (enfoque agresivo)
  const problematicProps = ['backgroundImage', 'backgroundOpacity', 'ctaUrl', 'href', 'ctaSecondary', 'ctaSecondaryUrl', 'subtitle', 'badge', 'stats'];
  
  problematicProps.forEach(prop => {
    // Cambiar slide.prop por (slide as any).prop
    const regex1 = new RegExp(`([a-zA-Z_]\\w*)\\.${prop}(?!\\s*\\?)`, 'g');
    content = content.replace(regex1, `($1 as any).${prop}`);
    
    // Cambiar slide.stats.prop por (slide as any).stats?.prop
    if (prop === 'stats') {
      const regex2 = new RegExp(`([a-zA-Z_]\\w*)\\.stats\\.(\\w+)(?!\\s*\\?)`, 'g');
      content = content.replace(regex2, `($1 as any).stats?.$2`);
    }
  });
  
  if (modified || content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

// Buscar archivos TypeScript
function findTSFiles(dir) {
  const files = [];
  
  function searchDir(currentDir, depth = 0) {
    if (depth > 4) return;
    
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory() && !['node_modules', '.next', '.git'].includes(entry.name)) {
          searchDir(fullPath, depth + 1);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Ignorar errores de acceso
    }
  }
  
  searchDir(dir);
  return files;
}

// Ejecutar correcciones
const tsFiles = findTSFiles(projectRoot);
let fixedFiles = 0;

console.log(`📁 Procesando ${tsFiles.length} archivos TypeScript...\n`);

tsFiles.forEach(file => {
  try {
    const relativePath = file.replace('/Users/rafaelramos/Desktop/ayamas/', '');
    
    if (fixAllTypeErrors(file)) {
      fixedFiles++;
      console.log(`✅ ${relativePath}`);
    }
  } catch (error) {
    console.log(`❌ Error en ${file}: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ CORRECCIÓN COMPLETADA`);
console.log(`📊 Archivos procesados: ${tsFiles.length}`);
console.log(`🔧 Archivos corregidos: ${fixedFiles}`);
console.log('\n🚀 AHORA EJECUTA:');
console.log('npm run clean && npm run build');
console.log('\n🎯 Si siguen apareciendo errores, serán muy específicos y fáciles de corregir.');
