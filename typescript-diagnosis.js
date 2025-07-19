import fs from 'fs';
import path from 'path';

const projectRoot = '/Users/rafaelramos/Desktop/ayamas/src';

console.log('🔧 DIAGNÓSTICO DIRECTO DE TYPESCRIPT');
console.log('='.repeat(50));

// 1. Verificar configuración de TypeScript
console.log('📋 Configuración de TypeScript:');
try {
  const tsconfig = fs.readFileSync('/Users/rafaelramos/Desktop/ayamas/tsconfig.json', 'utf8');
  const config = JSON.parse(tsconfig);
  
  console.log(`✓ strict: ${config.compilerOptions.strict}`);
  console.log(`✓ strictNullChecks: ${config.compilerOptions.strictNullChecks}`);
  console.log(`✓ skipLibCheck: ${config.compilerOptions.skipLibCheck}`);
  
  if (config.compilerOptions.strictNullChecks === false) {
    console.log('⚠️  PROBLEMA: strictNullChecks está en false, esto puede causar problemas de tipos');
  }
} catch (error) {
  console.error('❌ Error leyendo tsconfig.json:', error.message);
}

// 2. Buscar patrones problemáticos específicos
function findProblematicPatterns(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const problems = [];
  
  // Patrones que pueden causar errores de compilación
  const patterns = [
    { name: 'filter sin tipo', regex: /\.filter\(\s*[a-zA-Z_]\w*\s*=>\s*[^)]*\)/g },
    { name: 'error.message directo', regex: /error\.message(?!\s*\?)/g },
    { name: 'ObjectId comparison', regex: /\._id\s*[!=]==\s*[a-zA-Z_]/g },
    { name: 'as string cast', regex: /\s+as\s+string(?!\s*\|\s*undefined)/g },
    { name: 'new Image() call', regex: /new\s+Image\s*\(\s*\)/g },
    { name: 'property access on union', regex: /\.(?:backgroundImage|backgroundOpacity)(?!\?)/g }
  ];
  
  patterns.forEach(pattern => {
    const matches = [...content.matchAll(pattern.regex)];
    if (matches.length > 0) {
      matches.forEach(match => {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        problems.push({
          type: pattern.name,
          line: lineNumber,
          text: match[0].trim(),
          context: content.split('\n')[lineNumber - 1]?.trim()
        });
      });
    }
  });
  
  return problems;
}

// 3. Buscar archivos TypeScript
function findTSFiles(dir, maxFiles = 50) {
  const files = [];
  
  function searchDir(currentDir, depth = 0) {
    if (depth > 3 || files.length >= maxFiles) return; // Limitar profundidad y cantidad
    
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (files.length >= maxFiles) break;
        
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory() && !['node_modules', '.next', '.git'].includes(entry.name)) {
          searchDir(fullPath, depth + 1);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Saltar directorios que no se pueden leer
    }
  }
  
  searchDir(dir);
  return files;
}

// 4. Analizar archivos
console.log('\n🔍 Analizando archivos problemáticos...');
const tsFiles = findTSFiles(projectRoot);
console.log(`📁 Revisando ${tsFiles.length} archivos TypeScript\n`);

let totalProblems = 0;
const problemFiles = [];

tsFiles.forEach(file => {
  try {
    const relativePath = file.replace('/Users/rafaelramos/Desktop/ayamas/', '');
    const problems = findProblematicPatterns(file);
    
    if (problems.length > 0) {
      console.log(`❌ ${relativePath}`);
      problems.slice(0, 3).forEach(problem => { // Mostrar solo primeros 3 problemas por archivo
        console.log(`   Línea ${problem.line}: ${problem.type} - ${problem.text}`);
      });
      if (problems.length > 3) {
        console.log(`   ... y ${problems.length - 3} problema(s) más`);
      }
      console.log('');
      
      totalProblems += problems.length;
      problemFiles.push({ file: relativePath, problems });
    }
  } catch (error) {
    console.log(`⚠️  Error procesando ${file}: ${error.message}`);
  }
});

// 5. Resumen y recomendaciones
console.log('='.repeat(50));
console.log('📊 RESUMEN DEL DIAGNÓSTICO');
console.log('='.repeat(50));
console.log(`❌ Archivos con problemas: ${problemFiles.length}`);
console.log(`🔢 Total de problemas encontrados: ${totalProblems}`);

if (totalProblems > 0) {
  console.log('\n🛠️  RECOMENDACIONES INMEDIATAS:');
  console.log('1. Ejecutar: npm run build -- --no-cache');
  console.log('2. Si persisten errores, corregir manualmente los más críticos');
  console.log('3. Considerar cambiar strictNullChecks: true en tsconfig.json');
  console.log('\n📝 Archivos prioritarios para corregir:');
  
  problemFiles
    .sort((a, b) => b.problems.length - a.problems.length)
    .slice(0, 5)
    .forEach(item => {
      console.log(`   ${item.file} (${item.problems.length} problemas)`);
    });
} else {
  console.log('\n🎉 ¡No se encontraron problemas obvios en el código!');
  console.log('El problema puede estar en la configuración o caché.');
  console.log('Intenta: rm -rf .next && npm run build');
}

console.log('\n' + '='.repeat(50));
