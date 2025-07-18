# Scripts Obsoletos

Esta carpeta contiene scripts de migración y corrección de base de datos que ya han sido ejecutados y completados exitosamente. Se mantienen aquí como referencia histórica.

## ⚠️ IMPORTANTE

**Esta carpeta está EXCLUIDA del build de TypeScript y ESLint:**
- `tsconfig.json` → `"exclude": ["scripts-obsoletos"]`
- `.eslintrc.json` → `"ignorePatterns": ["scripts-obsoletos/**/*"]`

Esto evita errores de compilación ya que estos archivos tienen rutas de importación que ya no funcionan desde esta ubicación.

## Archivos Movidos

### Scripts de Migración de Base de Datos
- `force-update-schema.js` - Script para forzar actualización de esquema backgroundOpacity
- `migrate-carousel-cta-urls.js` - Migración de URLs del carrusel  
- `migrate-carousel-opacity.js` - Migración de opacidad del carrusel
- `migrate-simple.ts` - Script de migración simple
- `fix-specific-slide.js` - Corrección de slide específico

### Estado
- ✅ Todas las migraciones han sido ejecutadas exitosamente
- ✅ La base de datos está actualizada
- ✅ Estos scripts ya no son necesarios para el funcionamiento de la aplicación

### Motivo del Traslado
- Estos archivos tenían problemas de sintaxis (saltos de línea literales rotos)
- Causaban errores en el build de Next.js
- Ya cumplieron su propósito de migración

### Si Necesitas Restaurarlos
Si por alguna razón necesitas restaurar alguno de estos scripts:
```bash
cp scripts-obsoletos/[nombre-del-archivo] src/scripts/
```

Luego ejecuta el script de corrección de saltos de línea:
```bash
python3 fix_newlines_improved.py
```

---
*Movidos el: $(date)*
*Proyecto: Ayamas - Sistema de seguros*
