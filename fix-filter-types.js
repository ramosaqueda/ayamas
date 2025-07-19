import fs from 'fs';
import path from 'path';

const projectRoot = '/Users/rafaelramos/Desktop/ayamas';

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

// Función para corregir filters sin tipo
function fixFilterTypes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Patrones que buscamos corregir
  const patterns = [
    {
      // .filter(f => f.trim())
      regex: /\.filter\(\s*f\s*=>\s*f\.trim\(\)\s*\)/g,
      replacement: '.filter((f: string) => f.trim())'
    },
    {
      // .filter(f => f.trim().length > 0)
      regex: /\.filter\(\s*f\s*=>\s*f\.trim\(\)\.length\s*>\s*0\s*\)/g,
      replacement: '.filter((f: string) => f.trim().length > 0)'
    },
    {
      // .filter(f => f.something)
      regex: /\.filter\(\s*f\s*=>\s*f\./g,
      replacement: '.filter((f: string) => f.'
    },
    {
      // .filter(item => item.trim()) para otros casos
      regex: /\.filter\(\s*item\s*=>\s*item\.trim\(\)\s*\)/g,
      replacement: '.filter((item: string) => item.trim())'
    }
  ];
  
  patterns.forEach(pattern => {
    if (pattern.regex.test(content)) {
      content = content.replace(pattern.regex, pattern.replacement);
      modified = true;
      console.log(`✅ Corregido patrón en ${filePath}`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

// Ejecutar la corrección
console.log('🔍 Buscando archivos TypeScript...');
const tsFiles = findTypeScriptFiles(projectRoot);
console.log(`📁 Encontrados ${tsFiles.length} archivos TypeScript`);

let fixedFiles = 0;

tsFiles.forEach(file => {
  if (fixFilterTypes(file)) {
    fixedFiles++;
  }
});

console.log(`\n✅ Proceso completado. Se corrigieron ${fixedFiles} archivo(s).`);

if (fixedFiles === 0) {
  console.log('🔍 No se encontraron problemas de tipado en filter()');
  console.log('💡 El error puede estar en la caché. Ejecuta:');
  console.log('   rm -rf .next && npm run build');
}
