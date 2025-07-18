#!/usr/bin/env python3
"""
Script en Python para corregir problemas de saltos de línea en el proyecto ayamas.
Corrige casos donde aparece \\n literal en lugar de saltos de línea reales.
"""

import os
import re
import shutil
import sys
from pathlib import Path
from typing import List, Tuple, Dict

def should_skip_file(file_path: Path) -> bool:
    """Determina si un archivo debe ser omitido."""
    skip_dirs = {'.git', 'node_modules', '.next', '__pycache__', '.vscode'}
    skip_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot'}
    skip_files = {'.DS_Store', 'package-lock.json', 'yarn.lock'}
    
    # Verificar si está en directorio a omitir
    for part in file_path.parts:
        if part in skip_dirs:
            return True
    
    # Verificar extensión
    if file_path.suffix.lower() in skip_extensions:
        return True
    
    # Verificar nombre de archivo
    if file_path.name in skip_files:
        return True
    
    # Omitir archivos de backup
    if file_path.name.endswith('.backup'):
        return True
        
    return False

def detect_newline_problems(content: str) -> List[Tuple[str, int]]:
    """Detecta problemas de saltos de línea en el contenido."""
    problems = []
    
    # Buscar \\n literal (no como escape real)
    lines = content.split('\n')
    for line_num, line in enumerate(lines, 1):
        # Buscar \\n que no es un escape real
        if '\\n' in line:
            problems.append(('literal_newline', line_num))
        
        # Buscar \\t literal
        if '\\t' in line:
            problems.append(('literal_tab', line_num))
            
        # Buscar \\r literal
        if '\\r' in line:
            problems.append(('literal_carriage_return', line_num))
    
    return problems

def fix_newline_content(content: str, file_path: Path) -> Tuple[str, List[str]]:
    """Corrige problemas de saltos de línea en el contenido."""
    fixed_content = content
    changes = []
    
    # Patrones para corregir según el tipo de archivo
    if file_path.suffix in ['.js', '.ts', '.tsx', '.jsx']:
        # Para archivos JavaScript/TypeScript
        patterns = [
            # Strings con \\n literal que deberían ser saltos de línea
            (r'([\'"`])([^\'"`]*?)\\\\n([^\'"`]*?)\1', r'\1\2\n\3\1', 'Fixed literal \\\\n in strings'),
            
            # console.log con \\n literal
            (r'console\.(log|error|warn|info)\s*\(\s*[\'"`]([^\'"`]*?)\\\\n([^\'"`]*?)[\'"`]\s*\)', 
             r'console.\1(`\2\n\3`)', 'Fixed console statements with literal \\\\n'),
            
            # Error strings con \\n literal
            (r'(new\s+)?Error\s*\(\s*[\'"`]([^\'"`]*?)\\\\n([^\'"`]*?)[\'"`]\s*\)', 
             r'\1Error(`\2\n\3`)', 'Fixed Error strings with literal \\\\n'),
            
            # Template literals malformados
            (r'`([^`]*?)\\\\n([^`]*?)`', r'`\1\n\2`', 'Fixed template literals'),
        ]
    
    elif file_path.suffix in ['.md', '.txt']:
        # Para archivos Markdown y texto
        patterns = [
            (r'\\n', '\n', 'Fixed literal \\\\n'),
            (r'\\t', '\t', 'Fixed literal \\\\t'),
            (r'\\r', '\r', 'Fixed literal \\\\r'),
        ]
    
    elif file_path.suffix == '.json':
        # Para archivos JSON (más cuidadoso)
        patterns = [
            (r'"([^"]*?)\\\\n([^"]*?)"', r'"\1\n\2"', 'Fixed JSON strings with literal \\\\n'),
        ]
    
    else:
        # Para otros archivos, corrección básica
        patterns = [
            (r'\\n(?![\'"`])', '\n', 'Fixed literal \\\\n'),
            (r'\\t(?![\'"`])', '\t', 'Fixed literal \\\\t'),
        ]
    
    # Aplicar patrones
    for pattern, replacement, description in patterns:
        old_content = fixed_content
        fixed_content = re.sub(pattern, replacement, fixed_content, flags=re.MULTILINE)
        if fixed_content != old_content:
            changes.append(description)
    
    # Normalizar terminaciones de línea (CRLF -> LF)
    if '\r\n' in fixed_content:
        fixed_content = fixed_content.replace('\r\n', '\n')
        changes.append('Normalized CRLF to LF')
    
    return fixed_content, changes

def create_backup(file_path: Path) -> Path:
    """Crea un archivo de backup."""
    backup_path = file_path.with_name(file_path.name + '.backup')
    shutil.copy2(file_path, backup_path)
    return backup_path

def process_file(file_path: Path) -> Dict:
    """Procesa un archivo individual."""
    result = {
        'file': str(file_path),
        'processed': False,
        'changes': [],
        'errors': [],
        'backup_created': False
    }
    
    try:
        # Leer contenido original
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            original_content = f.read()
        
        # Detectar problemas
        problems = detect_newline_problems(original_content)
        
        if not problems:
            return result
        
        # Crear backup
        backup_path = create_backup(file_path)
        result['backup_created'] = True
        
        # Corregir contenido
        fixed_content, changes = fix_newline_content(original_content, file_path)
        
        # Escribir archivo corregido
        if fixed_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            
            result['processed'] = True
            result['changes'] = changes
            
            print(f"✅ {file_path.name}")
            for change in changes:
                print(f"   - {change}")
        else:
            # Eliminar backup si no hubo cambios
            backup_path.unlink()
            result['backup_created'] = False
            
    except Exception as e:
        result['errors'].append(str(e))
        print(f"❌ Error procesando {file_path.name}: {e}")
    
    return result

def find_files_to_process(project_root: Path) -> List[Path]:
    """Encuentra archivos que necesitan ser procesados."""
    extensions = {'.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.txt', '.env'}
    files = []
    
    for file_path in project_root.rglob('*'):
        if file_path.is_file() and not should_skip_file(file_path):
            if file_path.suffix in extensions or file_path.name.startswith('.env'):
                files.append(file_path)
    
    return sorted(files)

def main():
    """Función principal."""
    print("🔧 CORRECTOR DE SALTOS DE LÍNEA - PROYECTO AYAMAS")
    print("=" * 55)
    print("Corrigiendo archivos con \\n literal...")
    print()
    
    # Directorio del proyecto
    project_root = Path('/Users/rafaelramos/Desktop/ayamas')
    
    if not project_root.exists():
        print(f"❌ Error: El directorio {project_root} no existe")
        sys.exit(1)
    
    # Cambiar al directorio del proyecto
    os.chdir(project_root)
    
    # Encontrar archivos a procesar
    files_to_process = find_files_to_process(project_root)
    
    print(f"📁 Archivos encontrados: {len(files_to_process)}")
    print()
    
    # Procesar archivos
    results = []
    for file_path in files_to_process:
        result = process_file(file_path)
        results.append(result)
    
    # Resumen
    print("\n" + "=" * 55)
    print("📊 RESUMEN DE CORRECCIONES")
    print("=" * 55)
    
    processed_files = [r for r in results if r['processed']]
    error_files = [r for r in results if r['errors']]
    backup_files = [r for r in results if r['backup_created']]
    
    print(f"✅ Archivos corregidos: {len(processed_files)}")
    print(f"💾 Backups creados: {len(backup_files)}")
    print(f"❌ Errores: {len(error_files)}")
    
    if processed_files:
        print("\n🎉 Archivos corregidos exitosamente:")
        for result in processed_files:
            print(f"• {Path(result['file']).name}")
            for change in result['changes']:
                print(f"  - {change}")
    
    if error_files:
        print("\n❌ Archivos con errores:")
        for result in error_files:
            print(f"• {Path(result['file']).name}: {'; '.join(result['errors'])}")
    
    print(f"\n📋 Comandos útiles:")
    print("• Ver cambios: diff archivo.backup archivo")
    print("• Eliminar backups: find . -name '*.backup' -delete")
    print("• Probar app: npm run dev")
    
    print("\n🎯 ¡Corrección de saltos de línea completada!")

if __name__ == "__main__":
    main()
