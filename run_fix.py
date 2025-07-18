#!/usr/bin/env python3
"""
Script simple para probar y ejecutar la corrección de archivos.
"""

import os
import subprocess
import sys
from pathlib import Path

def test_project_structure():
    """Verifica la estructura del proyecto."""
    project_path = Path("/Users/rafaelramos/Desktop/ayamas")
    
    print("🔍 VERIFICACIÓN DEL PROYECTO")
    print("=" * 40)
    
    if not project_path.exists():
        print(f"❌ Proyecto no encontrado en: {project_path}")
        return False
    
    print(f"✅ Proyecto encontrado: {project_path}")
    
    # Verificar archivos clave
    key_files = [
        'package.json',
        'fix_newlines_improved.py',
        'fix-all-newlines.js',
        'fix-specific-newlines.js'
    ]
    
    print("\n📄 Archivos clave:")
    for file in key_files:
        file_path = project_path / file
        if file_path.exists():
            print(f"   ✅ {file}")
        else:
            print(f"   ❌ {file} (faltante)")
    
    return True

def run_improved_script():
    """Ejecuta el script mejorado de corrección."""
    project_path = Path("/Users/rafaelramos/Desktop/ayamas")
    script_path = project_path / "fix_newlines_improved.py"
    
    print("\n🚀 EJECUTANDO CORRECCIÓN")
    print("=" * 40)
    
    if not script_path.exists():
        print(f"❌ Script no encontrado: {script_path}")
        return False
    
    try:
        # Cambiar al directorio del proyecto
        os.chdir(project_path)
        
        print(f"📁 Directorio de trabajo: {os.getcwd()}")
        print(f"🐍 Ejecutando: python3 {script_path.name}")
        print()
        
        # Ejecutar el script
        result = subprocess.run([
            sys.executable, str(script_path)
        ], capture_output=True, text=True, cwd=project_path)
        
        print("📤 SALIDA DEL SCRIPT:")
        print("-" * 30)
        print(result.stdout)
        
        if result.stderr:
            print("\n⚠️  ERRORES:")
            print("-" * 30)
            print(result.stderr)
        
        print(f"\n📊 Código de salida: {result.returncode}")
        
        if result.returncode == 0:
            print("✅ Script ejecutado exitosamente")
            return True
        else:
            print("❌ Script falló")
            return False
            
    except Exception as e:
        print(f"❌ Error ejecutando script: {e}")
        return False

def show_next_steps():
    """Muestra los próximos pasos."""
    print("\n🎯 PRÓXIMOS PASOS")
    print("=" * 40)
    print("1. Verificar que los archivos se vean bien:")
    print("   code /Users/rafaelramos/Desktop/ayamas")
    print()
    print("2. Probar la aplicación:")
    print("   cd /Users/rafaelramos/Desktop/ayamas")
    print("   npm run dev")
    print()
    print("3. Si todo funciona bien, eliminar backups:")
    print("   find . -name '*.backup' -delete")
    print()
    print("4. Hacer commit de los cambios:")
    print("   git add .")
    print("   git commit -m 'Fix newline escape issues'")

def main():
    """Función principal."""
    print("🔧 CORRECTOR DE SALTOS DE LÍNEA - PROYECTO AYAMAS")
    print("=" * 50)
    print()
    
    # Verificar estructura
    if not test_project_structure():
        sys.exit(1)
    
    # Ejecutar corrección
    success = run_improved_script()
    
    # Mostrar próximos pasos
    show_next_steps()
    
    if success:
        print("\n🎉 ¡Proceso completado exitosamente!")
    else:
        print("\n⚠️  El proceso tuvo algunos problemas. Revisa la salida anterior.")
        sys.exit(1)

if __name__ == "__main__":
    main()
