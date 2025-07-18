# Corrección de Problemas de Salto de Línea - Proyecto Ayamas

Este documento explica cómo utilizar los scripts de corrección para solucionar problemas de saltos de línea en el proyecto.

## Problema Identificado

Los archivos del proyecto tenían problemas donde los caracteres `
` aparecían literalmente en lugar de ser interpretados como saltos de línea reales. Esto causaba:

- Archivos que se veían mal formateados
- Posibles errores en la ejecución de scripts
- Problemas de legibilidad del código

## Scripts de Corrección Disponibles

### 1. `fix-newlines.js` - Corrección General
**Uso:** `npm run fix:newlines` o `node fix-newlines.js`

- Escanea todos los archivos del proyecto (`.js`, `.ts`, `.tsx`, `.jsx`, `.json`, `.md`, `.txt`)
- Excluye automáticamente `node_modules`, `.git`, `.next`
- Corrige problemas de:
  - `
` literal → salto de línea real
  - `	` literal → tab real  
  - `
` literal → retorno de carro real
  - Terminaciones CRLF (Windows) → LF (Unix)

### 2. `fix-specific-newlines.js` - Corrección Específica JavaScript/TypeScript
**Uso:** `npm run fix:newlines:specific` o `node fix-specific-newlines.js`

- Se enfoca en archivos específicos de migración y scripts
- Corrige problemas específicos en:
  - `fix-categories.js`
  - `migrate-direct.js`
  - `run-migration.js`
  - `verify-migration.js`
  - `src/scripts/migrate-categories.ts`
  - `src/scripts/migrate-simple.ts`
- Soluciona patrones problemáticos en `console.log()` y strings de error

### 3. `fix-all-newlines.js` - Script Maestro
**Uso:** `npm run fix:newlines:all` o `node fix-all-newlines.js`

- Ejecuta automáticamente todas las correcciones en secuencia
- Proporciona un resumen completo de todas las correcciones aplicadas
- **Recomendado para uso general**

## Instrucciones de Uso

### Opción Rápida (Recomendada)
```bash
cd /Users/rafaelramos/Desktop/ayamas
npm run fix:newlines:all
```

### Paso a Paso
```bash
# 1. Corrección general
npm run fix:newlines

# 2. Corrección específica
npm run fix:newlines:specific

# 3. Verificar resultados
ls -la *.backup
```

## Características de Seguridad

### Archivos de Backup Automáticos
- Todos los scripts crean automáticamente archivos `.backup` antes de hacer cambios
- Los backups contienen el contenido original de cada archivo modificado
- Formato: `nombre-archivo.js.backup`

### Verificación de Cambios
```bash
# Ver diferencias entre original y corregido
diff archivo.js.backup archivo.js

# Ver todos los backups creados
find . -name "*.backup" -ls
```

### Limpieza de Backups
```bash
# Eliminar todos los backups después de verificar
find . -name "*.backup" -delete

# O eliminar backups específicos
rm *.backup
```

## Archivos Procesados

### Archivos de Configuración
- `package.json`
- `.eslintrc.json`
- `tsconfig.json`
- `next.config.js`
- `postcss.config.js`
- `tailwind.config.js`

### Scripts de Migración
- `fix-categories.js`
- `migrate-direct.js`
- `run-migration.js`
- `verify-migration.js`
- `src/scripts/migrate-categories.ts`
- `src/scripts/migrate-simple.ts`

### Código Fuente
- Todos los archivos en `src/` con extensiones: `.js`, `.ts`, `.tsx`, `.jsx`
- Archivos de componentes React
- APIs y modelos
- Hooks y utilidades

## Verificación Post-Corrección

### 1. Verificar Formato Visual
```bash
# Abrir archivos en tu editor favorito y verificar que se vean correctamente
code src/scripts/migrate-categories.ts
```

### 2. Probar la Aplicación
```bash
# Verificar que no hay errores de sintaxis
npm run type-check

# Ejecutar el servidor de desarrollo
npm run dev

# Probar las migraciones
npm run migrate:categories
```

### 3. Verificar Scripts de Migración
```bash
# Probar script específico
node fix-categories.js

# Verificar migración directa
node migrate-direct.js
```

## Solución de Problemas

### Si Aparecen Errores de Sintaxis
1. Restaurar desde backup:
   ```bash
   cp archivo.js.backup archivo.js
   ```

2. Ejecutar corrección específica:
   ```bash
   npm run fix:newlines:specific
   ```

### Si los Archivos Siguen Viéndose Mal
1. Verificar la codificación del archivo:
   ```bash
   file -I archivo.js
   ```

2. Convertir codificación si es necesario:
   ```bash
   iconv -f ISO-8859-1 -t UTF-8 archivo.js > archivo_fixed.js
   ```

### Si las Migraciones Fallan
1. Verificar variables de entorno:
   ```bash
   cat .env.local | grep MONGODB_URI
   ```

2. Probar conexión a MongoDB:
   ```bash
   npm run verify
   ```

## Patrones Corregidos

### Antes de la Corrección
```javascript
console.log('Error durante la migración:\\nRevisar configuración')
throw new Error('MONGODB_URI no está definida\\nen .env.local')
const message = 'Proceso completado\\n\\tArchivos procesados: 5'
```

### Después de la Corrección
```javascript
console.log('Error durante la migración:
Revisar configuración')
throw new Error('MONGODB_URI no está definida
en .env.local')
const message = 'Proceso completado
	Archivos procesados: 5'
```

## Comandos Útiles

```bash
# Ver el estado actual del proyecto
npm run type-check

# Linter con corrección automática
npm run lint:fix

# Ejecutar migraciones después de la corrección
npm run migrate:categories

# Verificar que todo funciona
npm run dev
```

## Mantenimiento Futuro

Para evitar que vuelvan a aparecer estos problemas:

1. **Configurar el editor** para mostrar caracteres especiales
2. **Usar un linter** que detecte estos problemas automáticamente
3. **Configurar git hooks** para verificar archivos antes del commit
4. **Usar herramientas de formateo** como Prettier

---

## Contacto y Soporte

Si encuentras problemas adicionales o necesitas ayuda:
1. Revisar los logs de los scripts de corrección
2. Verificar los archivos `.backup` para restaurar si es necesario
3. Ejecutar `npm run fix:newlines:all` nuevamente

**¡Los problemas de salto de línea han sido corregidos exitosamente!** 🎉
