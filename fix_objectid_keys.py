#!/usr/bin/env python3
"""
Script para buscar y corregir automáticamente todos los usos de ObjectId como React keys
y en URLs sin convertir a string.
"""

import os
import re
import shutil
from pathlib import Path

def fix_objectid_in_file(file_path: Path) -> bool:
    """Corrige problemas de ObjectId en un archivo específico."""
    print(f"🔧 Verificando: {file_path.relative_to(Path('/Users/rafaelramos/Desktop/ayamas'))}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = []
        
        # Patrones para corregir ObjectIds
        patterns = [
            # React keys: key={item._id} → key={item._id.toString()}
            (r'key=\{([^}]+\._id)\}', r'key={\1.toString()}', 'Fixed React keys with ObjectId'),
            
            # URLs en router.push: `/path/${item._id}` → `/path/${item._id.toString()}`
            (r'router\.push\(`([^`]*?)\$\{([^}]+\._id)\}([^`]*?)`\)', 
             r'router.push(`\1${\2.toString()}\3`)', 'Fixed router.push URLs with ObjectId'),
             
            # URLs en fetch: `/api/endpoint/${item._id}` → `/api/endpoint/${item._id.toString()}`
            (r'fetch\(`([^`]*?)\$\{([^}]+\._id)\}([^`]*?)`', 
             r'fetch(`\1${\2.toString()}\3`', 'Fixed fetch URLs with ObjectId'),
             
            # Comparaciones simples: item._id === other._id → item._id.toString() === other._id.toString()
            (r'([a-zA-Z_$][a-zA-Z0-9_$]*\._id)\s*([!=]==?)\s*([a-zA-Z_$][a-zA-Z0-9_$]*\._id)', 
             r'\1.toString() \2 \3.toString()', 'Fixed ObjectId comparisons'),
        ]
        
        for pattern, replacement, description in patterns:
            old_content = content
            content = re.sub(pattern, replacement, content)
            
            if content != old_content:
                changes.append(description)
        
        # Si hubo cambios, crear backup y guardar
        if content != original_content:
            # Crear backup
            backup_path = file_path.with_suffix(file_path.suffix + '.backup')
            shutil.copy2(file_path, backup_path)
            
            # Guardar archivo corregido
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"   ✅ Corregido ({len(changes)} cambios)")
            for change in changes:
                print(f"      - {change}")
            print(f"   💾 Backup: {backup_path.name}")
            return True
        else:
            print(f"   ℹ️  Sin cambios necesarios")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def find_react_files(project_root: Path) -> list:
    """Encuentra archivos React/Next.js que podrían tener ObjectIds."""
    extensions = {'.tsx', '.ts', '.jsx', '.js'}
    files = []
    
    for file_path in project_root.rglob('*'):
        if (file_path.is_file() and 
            file_path.suffix in extensions and
            not any(skip in str(file_path) for skip in [
                'node_modules', '.next', '.git', 'scripts-obsoletos', '__pycache__'
            ])):
            files.append(file_path)
    
    return sorted(files)

def main():
    """Función principal."""
    print("🔧 CORRECTOR AUTOMÁTICO DE OBJECTID")
    print("=" * 50)
    print("Buscando y corrigiendo ObjectId sin .toString()...")
    print()
    
    project_root = Path("/Users/rafaelramos/Desktop/ayamas")
    
    if not project_root.exists():
        print(f"❌ Proyecto no encontrado: {project_root}")
        return
    
    # Buscar archivos React/Next.js
    files = find_react_files(project_root)
    print(f"📁 Archivos encontrados: {len(files)}")
    print()
    
    # Procesar archivos
    fixed_count = 0
    total_files = len(files)
    
    for file_path in files:
        if fix_objectid_in_file(file_path):
            fixed_count += 1
    
    print("\n" + "=" * 50)
    print("📊 RESUMEN")
    print("=" * 50)
    print(f"📂 Archivos procesados: {total_files}")
    print(f"✅ Archivos corregidos: {fixed_count}")
    print(f"ℹ️  Archivos sin cambios: {total_files - fixed_count}")
    
    if fixed_count > 0:
        print(f"\n🎉 {fixed_count} archivos fueron corregidos automáticamente!")
        print("\n💾 Para ver los cambios:")
        print("   diff archivo.tsx.backup archivo.tsx")
        print("\n🗑️  Para eliminar backups:")
        print("   find . -name '*.backup' -delete")
        print("\n🚀 Ahora ejecuta:")
        print("   npm run build")
    else:
        print("\n✅ No se encontraron problemas de ObjectId")
    
    print(f"\n🎯 ¡Corrección automática completada!")

if __name__ == "__main__":
    main()
