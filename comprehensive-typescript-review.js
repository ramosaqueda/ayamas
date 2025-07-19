import fs from 'fs';
import path from 'path';

const projectRoot = '/Users/rafaelramos/Desktop/ayamas/src';

// Función para buscar archivos .ts y .tsx recursivamente
function findTypeScriptFiles(dir) {
  const files = [];
  
  function searchDir(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory() && !['node_modules', '.next', '.git'].includes(entry.name)) {
          searchDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.log(`Error reading directory ${currentDir}:`, error.message);
    }
  }
  
  searchDir(dir);
  return files;
}

// Función para aplicar todas las correcciones
function applyAllFixes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const fixes = [];

  // 1. FILTROS SIN TIPO
  const filterPatterns = [
    {
      name: 'filter(f => f.trim())',
      regex: /\.filter\(\s*f\s*=>\s*f\.trim\(\)\s*\)/g,
      replacement: '.filter((f: string) => f.trim())'
    },
    {
      name: 'filter(f => f.trim().length)',
      regex: /\.filter\(\s*f\s*=>\s*f\.trim\(\)\.length\s*[><=!]\s*\d+\s*\)/g,
      replacement: (match) => match.replace('f =>', '(f: string) =>')
    },
    {
      name: 'filter(item => item.trim())',
      regex: /\.filter\(\s*item\s*=>\s*item\.trim\(\)\s*\)/g,
      replacement: '.filter((item: string) => item.trim())'
    },
    {
      name: 'filter(feature => feature.trim())',
      regex: /\.filter\(\s*feature\s*=>\s*feature\.trim\(\)\s*\)/g,
      replacement: '.filter((feature: string) => feature.trim())'
    },
    {
      name: 'filter genérico sin tipo',
      regex: /\.filter\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=>\s*\1\.trim\(\)/g,
      replacement: '.filter(($1: string) => $1.trim()'
    }
  ];

  // 2. COMPARACIONES OBJECTID vs STRING
  const objectIdPatterns = [
    {
      name: 'ObjectId comparison with !==',
      regex: /([a-zA-Z_][a-zA-Z0-9_]*\._id)\s*!==\s*([a-zA-Z_][a-zA-Z0-9_]*)/g,
      replacement: '$1.toString() !== $2'
    },
    {
      name: 'ObjectId comparison with ===',
      regex: /([a-zA-Z_][a-zA-Z0-9_]*\._id)\s*===\s*([a-zA-Z_][a-zA-Z0-9_]*)/g,
      replacement: '$1.toString() === $2'
    }
  ];

  // 3. MANEJO DE ERRORES SIN TIPO
  const errorPatterns = [
    {
      name: 'catch without type',
      regex: /catch\s*\(\s*error\s*\)\s*{/g,
      replacement: 'catch (error: unknown) {'
    },
    {
      name: 'error.message access',
      regex: /error\.message/g,
      replacement: (match, offset) => {
        // Solo reemplazar si no está ya en un contexto de verificación de tipo
        const before = content.substring(Math.max(0, offset - 50), offset);
        if (before.includes('instanceof Error') || before.includes('error: unknown')) {
          return match; // No cambiar si ya está manejado correctamente
        }
        return '(error instanceof Error ? error.message : String(error))';
      }
    }
  ];

  // 4. CONVERSIONES DE TIPO INSEGURAS
  const castPatterns = [
    {
      name: 'unsafe as string cast',
      regex: /([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s+as\s+string/g,
      replacement: '$1?.toString() || \'\''
    }
  ];

  // 5. VALIDACIONES DE OBJECTID MEJORADAS
  const objectIdValidationPatterns = [
    {
      name: 'ObjectId.isValid with complex object',
      regex: /mongoose\.Types\.ObjectId\.isValid\(\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s*\)/g,
      replacement: 'mongoose.Types.ObjectId.isValid($1?.toString())'
    }
  ];

  // Aplicar todas las correcciones
  const allPatterns = [
    ...filterPatterns,
    ...objectIdPatterns,
    ...errorPatterns,
    ...castPatterns,
    ...objectIdValidationPatterns
  ];

  allPatterns.forEach(pattern => {
    const beforeContent = content;
    
    if (typeof pattern.replacement === 'function') {
      content = content.replace(pattern.regex, pattern.replacement);
    } else {
      content = content.replace(pattern.regex, pattern.replacement);
    }
    
    if (content !== beforeContent) {
      modified = true;
      fixes.push(pattern.name);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    return fixes;
  }
  
  return [];
}

// Función para analizar problemas sin corregir
function analyzeProblems(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const problems = [];

  // Buscar patrones problemáticos
  const checks = [
    { name: 'filter sin tipo', regex: /\.filter\(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*=>\s*[^)]*\)/g },
    { name: 'ObjectId comparison', regex: /\._id\s*[!=]==\s*[a-zA-Z_]/g },
    { name: 'error.message directo', regex: /error\.message(?!\s*:)/g },
    { name: 'as string cast', regex: /\s+as\s+string/g },
    { name: 'catch sin tipo', regex: /catch\s*\(\s*error\s*\)/g }
  ];

  checks.forEach(check => {
    const matches = content.match(check.regex);
    if (matches) {
      problems.push(`${check.name}: ${matches.length} ocurrencia(s)`);
    }
  });

  return problems;
}

// Ejecutar la revisión completa
console.log('🔍 REVISIÓN GENERAL DE TYPESCRIPT - PROYECTO AYAMAS');
console.log('='.repeat(60));

const tsFiles = findTypeScriptFiles(projectRoot);
console.log(`📁 Encontrados ${tsFiles.length} archivos TypeScript para revisar\n`);

let totalFixedFiles = 0;
let totalFixes = 0;
const detailedReport = [];

// Paso 1: Aplicar correcciones automáticas
console.log('⚡ PASO 1: Aplicando correcciones automáticas...\n');

tsFiles.forEach(file => {
  const relativePath = file.replace('/Users/rafaelramos/Desktop/ayamas/', '');
  const fixes = applyAllFixes(file);
  
  if (fixes.length > 0) {
    totalFixedFiles++;
    totalFixes += fixes.length;
    console.log(`✅ ${relativePath}`);
    fixes.forEach(fix => console.log(`   - ${fix}`));
    detailedReport.push({ file: relativePath, fixes });
    console.log('');
  }
});

// Paso 2: Analizar problemas restantes
console.log('\n🔍 PASO 2: Analizando problemas restantes...\n');

const remainingProblems = [];
tsFiles.forEach(file => {
  const relativePath = file.replace('/Users/rafaelramos/Desktop/ayamas/', '');
  const problems = analyzeProblems(file);
  
  if (problems.length > 0) {
    console.log(`⚠️  ${relativePath}`);
    problems.forEach(problem => console.log(`   - ${problem}`));
    remainingProblems.push({ file: relativePath, problems });
    console.log('');
  }
});

// Resumen final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE REVISIÓN GENERAL');
console.log('='.repeat(60));
console.log(`✅ Archivos corregidos: ${totalFixedFiles}`);
console.log(`🔧 Total de correcciones aplicadas: ${totalFixes}`);
console.log(`⚠️  Archivos con problemas restantes: ${remainingProblems.length}`);

if (totalFixedFiles === 0 && remainingProblems.length === 0) {
  console.log('\n🎉 ¡EXCELENTE! No se encontraron problemas de TypeScript.');
} else if (totalFixedFiles > 0) {
  console.log('\n🚀 Correcciones aplicadas exitosamente. Ahora ejecuta:');
  console.log('   npm run build');
} else {
  console.log('\n💡 Se encontraron algunos problemas que requieren revisión manual.');
}

console.log('\n' + '='.repeat(60));
