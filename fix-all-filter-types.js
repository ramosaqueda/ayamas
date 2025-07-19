import fs from 'fs';
import path from 'path';

const projectRoot = '/Users/rafaelramos/Desktop/ayamas/src';

// Función para buscar archivos .ts y .tsx recursivamente
function findTypeScriptFiles(dir) {
  const files = [];
  
  function searchDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !['node_modules', '.next', '.git'].includes(entry.name)) {
        searchDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    }
  }
  
  searchDir(dir);
  return files;
}

// Función para corregir todos los patterns de filter sin tipo
function fixAllFilterTypes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Patrones que buscamos corregir - todos los casos de filter sin tipo
  const patterns = [
    {
      // .filter(f => f.trim())
      regex: /\.filter\(\s*f\s*=>\s*f\.trim\(\)\s*\)/g,
      replacement: '.filter((f: string) => f.trim())'
    },
    {
      // .filter(f => f.trim().length > 0) o similar
      regex: /\.filter\(\s*f\s*=>\s*f\.trim\(\)[^)]*\)/g,
      replacement: (match) => match.replace('f =>', '(f: string) =>')
    },
    {
      // .filter(f => f.algo) - casos generales
      regex: /\.filter\(\s*f\s*=>\s*f\./g,
      replacement: '.filter((f: string) => f.'
    },
    {
      // .filter(item => item.trim()) para otros casos
      regex: /\.filter\(\s*item\s*=>\s*item\.trim\(\)\s*\)/g,
      replacement: '.filter((item: string) => item.trim())'
    },
    {
      // .filter(feature => feature.trim()) para casos específicos
      regex: /\.filter\(\s*feature\s*=>\s*feature\.trim\(\)\s*\)/g,
      replacement: '.filter((feature: string) => feature.trim())'
    },
    {
      // Caso más general para cualquier variable
      regex: /\.filter\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=>\s*\1\.trim\(\)/g,
      replacement: '.filter(($1: string) => $1.trim()'
    }
  ];
  
  patterns.forEach(pattern => {
    if (typeof pattern.replacement === 'function') {
      if (pattern.regex.test(content)) {
        content = content.replace(pattern.regex, pattern.replacement);
        modified = true;
      }
    } else {
      if (pattern.regex.test(content)) {
        content = content.replace(pattern.regex, pattern.replacement);
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Corregido: ${filePath}`);
    return true;
  }
  
  return false;
}

// Ejecutar la corrección
console.log('🔍 Buscando y corrigiendo todos los filtros sin tipo...');
const tsFiles = findTypeScriptFiles(projectRoot);
console.log(`📁 Revisando ${tsFiles.length} archivos TypeScript`);

let fixedFiles = 0;
const fixedList = [];

tsFiles.forEach(file => {
  if (fixAllFilterTypes(file)) {
    fixedFiles++;
    fixedList.push(file);
  }
});

console.log(`\n✅ Proceso completado!`);
console.log(`📊 Se corrigieron ${fixedFiles} archivo(s):`);
fixedList.forEach(file => {
  const relativePath = file.replace('/Users/rafaelramos/Desktop/ayamas/', '');
  console.log(`   - ${relativePath}`);
});

if (fixedFiles === 0) {
  console.log('🎉 No se encontraron más problemas de tipado en filter()');
} else {
  console.log('\n🔨 Ahora ejecuta:');
  console.log('   npm run build');
  console.log('   para verificar que todo esté correcto');
}
