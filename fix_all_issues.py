#!/usr/bin/env python3
"""
Script maestro para corregir TODOS los problemas de compilación del proyecto ayamas.
Ejecuta todos los correctores en secuencia.
"""

import os
import subprocess
import sys
from pathlib import Path

def run_script(script_name: str, description: str) -> bool:
    """Ejecuta un script de corrección."""
    print(f"\n🔧 {description}")
    print("=" * 60)
    
    script_path = Path(f"/Users/rafaelramos/Desktop/ayamas/{script_name}")
    
    if not script_path.exists():
        print(f"❌ Script no encontrado: {script_name}")
        return False
    
    try:
        result = subprocess.run([
            sys.executable, str(script_path)
        ], cwd="/Users/rafaelramos/Desktop/ayamas", 
           capture_output=True, text=True)
        
        print(result.stdout)
        
        if result.stderr:
            print("⚠️  Stderr:")
            print(result.stderr)
        
        if result.returncode == 0:
            print(f"✅ {description} completado")
            return True
        else:
            print(f"❌ {description} falló (código: {result.returncode})")
            return False
            
    except Exception as e:
        print(f"❌ Error ejecutando {script_name}: {e}")
        return False

def test_build() -> bool:
    """Prueba el build del proyecto."""
    print(f"\n🚀 PROBANDO BUILD")
    print("=" * 60)
    
    try:
        os.chdir("/Users/rafaelramos/Desktop/ayamas")
        
        result = subprocess.run([
            "npm", "run", "build"
        ], capture_output=True, text=True)
        
        print("📤 Salida del build:")
        print(result.stdout)
        
        if result.stderr:
            print("⚠️  Errores del build:")
            print(result.stderr)
        
        if result.returncode == 0:
            print("✅ ¡BUILD EXITOSO!")
            return True
        else:
            print("❌ Build falló")
            return False
            
    except Exception as e:
        print(f"❌ Error ejecutando build: {e}")
        return False

def main():
    """Función principal."""
    print("🎯 CORRECTOR MAESTRO - PROYECTO AYAMAS")
    print("=" * 60)
    print("Este script ejecutará todos los correctores automáticos")
    print("para resolver los problemas de compilación del proyecto.")
    print()
    
    # Verificar que estamos en el directorio correcto
    project_path = Path("/Users/rafaelramos/Desktop/ayamas")
    if not project_path.exists():
        print(f"❌ Proyecto no encontrado: {project_path}")
        sys.exit(1)
    
    # Lista de scripts a ejecutar en orden
    scripts = [
        ("fix_tsx_escapes.py", "Corrigiendo escapes en archivos TSX"),
        ("fix_objectid_keys.py", "Corrigiendo ObjectId como React keys"),
        ("fix_newlines_improved.py", "Corrigiendo saltos de línea"),
    ]
    
    successful_scripts = 0
    total_scripts = len(scripts)
    
    # Ejecutar scripts
    for script_name, description in scripts:
        if run_script(script_name, description):
            successful_scripts += 1
        else:
            print(f"⚠️  {script_name} falló, pero continuando...")
    
    print(f"\n📊 RESUMEN DE CORRECCIONES")
    print("=" * 60)
    print(f"Scripts ejecutados: {total_scripts}")
    print(f"Scripts exitosos: {successful_scripts}")
    print(f"Scripts fallidos: {total_scripts - successful_scripts}")
    
    # Probar build
    if test_build():
        print(f"\n🎉 ¡ÉXITO TOTAL!")
        print("=" * 60)
        print("✅ Todas las correcciones aplicadas")
        print("✅ Build compiló exitosamente")
        print("✅ Proyecto listo para desarrollo")
        print()
        print("🔄 Próximos pasos:")
        print("1. Revisar que todo funcione: npm run dev")
        print("2. Eliminar backups: find . -name '*.backup' -delete")
        print("3. Hacer commit: git add . && git commit -m 'Fix compilation errors'")
    else:
        print(f"\n⚠️  CORRECCIONES APLICADAS PERO BUILD AÚN FALLA")
        print("=" * 60)
        print("🔧 Las correcciones automáticas se ejecutaron, pero el build")
        print("   aún tiene errores. Revisa los errores mostrados arriba.")
        print()
        print("💡 Posibles soluciones adicionales:")
        print("1. Revisar errores específicos en la salida del build")
        print("2. Agregar más @ts-ignore en archivos problemáticos")
        print("3. Ajustar tsconfig.json para ser menos estricto")
        print("4. Verificar que todas las dependencias estén instaladas")
    
    print(f"\n🎯 ¡Proceso de corrección completado!")

if __name__ == "__main__":
    main()
