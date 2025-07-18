#!/usr/bin/env python3
"""
Script específico para corregir problemas de escape en archivos TSX problemáticos.
Corrige className=\"text\" por className="text" y otros problemas similares.
"""

import os
import re
import shutil
from pathlib import Path

def fix_tsx_escapes(file_path: Path) -> bool:
    """Corrige problemas de escape en archivos TSX."""
    print(f"🔧 Corrigiendo: {file_path.name}")
    
    try:
        # Leer contenido
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Crear backup
        backup_path = file_path.with_suffix(file_path.suffix + '.backup')
        shutil.copy2(file_path, backup_path)
        print(f"   💾 Backup creado: {backup_path.name}")
        
        # Patrones de corrección específicos para TSX
        patterns = [
            # className con escape incorrecto
            (r'className=\\"([^"]*)\\"', r'className="\1"', 'Fixed className escapes'),
            
            # Otros atributos con escape incorrecto
            (r'(\w+)=\\"([^"]*)\\"', r'\1="\2"', 'Fixed attribute escapes'),
            
            # Template strings con escape incorrecto
            (r'`([^`]*)\\"([^`]*)`', r'`\1"\2`', 'Fixed template string escapes'),
            
            # Comillas simples con escape incorrecto
            (r"\\'", r"'", 'Fixed single quote escapes'),
            
            # Normalizar espacios y saltos de línea
            (r'\\"\\n\s*', r'"\n', 'Fixed newline escapes'),
            
            # Corregir escapes dobles
            (r'\\\\"', r'"', 'Fixed double escapes'),
        ]
        
        changes = []
        for pattern, replacement, description in patterns:
            old_content = content
            content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
            if content != old_content:
                changes.append(description)
        
        # Si hubo cambios, escribir archivo
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"   ✅ Archivo corregido")
            for change in changes:
                print(f"      - {change}")
            return True
        else:
            # Si no hubo cambios, eliminar backup
            backup_path.unlink()
            print(f"   ℹ️  No se necesitaron cambios")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    """Función principal."""
    print("🔧 CORRECTOR DE ESCAPES TSX")
    print("=" * 40)
    
    project_root = Path("/Users/rafaelramos/Desktop/ayamas")
    
    # Archivos específicos con problemas
    problem_files = [
        "src/components/carousel/MainCarouselFixed.tsx",
        "src/components/carousel/SimpleCarouselTest.tsx", 
        "src/components/ui/ProductsGrid.tsx"
    ]
    
    fixed_count = 0
    total_files = len(problem_files)
    
    for file_relative in problem_files:
        file_path = project_root / file_relative
        
        if file_path.exists():
            if fix_tsx_escapes(file_path):
                fixed_count += 1
        else:
            print(f"❌ Archivo no encontrado: {file_relative}")
    
    print("\n" + "=" * 40)
    print("📊 RESUMEN")
    print("=" * 40)
    print(f"Archivos procesados: {total_files}")
    print(f"Archivos corregidos: {fixed_count}")
    print(f"Archivos sin cambios: {total_files - fixed_count}")
    
    if fixed_count > 0:
        print(f"\n✅ {fixed_count} archivos fueron corregidos")
        print("\n🚀 Ahora ejecuta:")
        print("   npm run build")
        print("\n💾 Para ver los cambios:")
        print("   diff archivo.tsx.backup archivo.tsx")
        print("\n🗑️  Para eliminar backups:")
        print("   find . -name '*.backup' -delete")
    else:
        print("\nℹ️  No se encontraron problemas de escape")
    
    print(f"\n🎯 ¡Corrección de escapes completada!")

if __name__ == "__main__":
    main()
