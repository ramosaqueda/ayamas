#!/usr/bin/env python3
"""
Script mejorado para corregir problemas de saltos de línea en el proyecto ayamas.
Versión más robusta que maneja múltiples tipos de problemas de escape.
"""

import os
import re
import shutil
import sys
from pathlib import Path
from typing import List, Tuple, Dict
import json

class NewlineFixer:
    def __init__(self, project_root: str = "/Users/rafaelramos/Desktop/ayamas"):
        self.project_root = Path(project_root)
        self.stats = {
            'files_processed': 0,
            'files_fixed': 0,
            'backups_created': 0,
            'errors': 0,
            'total_fixes': 0
        }
        
        # Patrones específicos para diferentes tipos de archivos
        self.js_patterns = [
            # Strings con \n literal que deben ser saltos reales
            (r"(['\"``])([^'\"``]*?)\\\\n([^'\"``]*?)\1", r'\1\2\n\3\1', 'Fixed literal \\\\n in strings'),
            
            # console.log con \n literal
            (r"console\.(log|error|warn|info)\s*\(\s*['\"]([^'\"]*?)\\\\n([^'\"]*?)['\"]\s*\)", 
             r'console.\1(`\2\n\3`)', 'Fixed console statements with literal \\\\n'),
            
            # Error strings con \n literal
            (r"(new\s+)?Error\s*\(\s*['\"]([^'\"]*?)\\\\n([^'\"]*?)['\"]\s*\)", 
             r'\1Error(`\2\n\3`)', 'Fixed Error strings with literal \\\\n'),
            
            # Template literals con problemas
            (r"`([^`]*?)\\\\n([^`]*?)`", r'`\1\n\2`', 'Fixed template literals'),
            
            # Comentarios que terminaron con \n literal
            (r"//\s*([^\\n]*?)\\\\n\s*$", r'// \1\n', 'Fixed comment endings'),
        ]
        
        self.general_patterns = [
            # \n literal básico (no en strings)
            (r'(?<![\\\'])\\n(?![\'\"])', '\n', 'Fixed basic literal \\\\n'),
            
            # \t literal básico
            (r'(?<![\\\'])\\t(?![\'\"])', '\t', 'Fixed basic literal \\\\t'),
            
            # \r literal básico
            (r'(?<![\\\'])\\r(?![\'\"])', '\r', 'Fixed basic literal \\\\r'),
        ]

    def should_skip_file(self, file_path: Path) -> bool:
        """Determina si un archivo debe ser omitido."""
        skip_dirs = {'.git', 'node_modules', '.next', '__pycache__', '.vscode', 'dist', 'build'}
        skip_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.bin', '.exe'}
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
        if file_path.name.endswith('.backup') or file_path.name.endswith('.bak'):
            return True
            
        # Omitir archivos binarios comunes
        if file_path.stat().st_size > 10 * 1024 * 1024:  # > 10MB
            return True
            
        return False

    def detect_problems(self, content: str, file_path: Path) -> List[Dict]:
        """Detecta problemas específicos en el contenido."""
        problems = []
        lines = content.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            # Buscar \n literal (escapado incorrectamente)
            if '\\n' in line and not '\\\\n' in line:
                problems.append({
                    'type': 'literal_newline',
                    'line': line_num,
                    'content': line[:100] + '...' if len(line) > 100 else line
                })
            
            # Buscar console.log rotos
            if re.search(r'console\.(log|error|warn|info)\([^)]*\\n[^)]*\)', line):
                problems.append({
                    'type': 'broken_console',
                    'line': line_num,
                    'content': line[:100] + '...' if len(line) > 100 else line
                })
                
            # Buscar strings rotos que probablemente deberían tener saltos
            if re.search(r'[\'\"``][^\'\"``]*\\n[^\'\"``]*[\'\"``]', line):
                problems.append({
                    'type': 'string_with_literal_newline',
                    'line': line_num,
                    'content': line[:100] + '...' if len(line) > 100 else line
                })
        
        return problems

    def fix_content(self, content: str, file_path: Path) -> Tuple[str, List[str]]:
        """Aplica correcciones al contenido según el tipo de archivo."""
        fixed_content = content
        changes = []
        
        # Determinar qué patrones aplicar según la extensión
        if file_path.suffix in ['.js', '.ts', '.tsx', '.jsx']:
            patterns = self.js_patterns + self.general_patterns
        elif file_path.suffix in ['.json']:
            # Para JSON, ser más conservador
            patterns = [
                (r'"([^"]*?)\\\\n([^"]*?)"', r'"\1\n\2"', 'Fixed JSON strings with literal \\\\n'),
            ]
        elif file_path.suffix in ['.md', '.txt']:
            patterns = self.general_patterns
        else:
            patterns = self.general_patterns
        
        # Aplicar cada patrón
        for pattern, replacement, description in patterns:
            old_content = fixed_content
            try:
                fixed_content = re.sub(pattern, replacement, fixed_content, flags=re.MULTILINE)
                if fixed_content != old_content:
                    changes.append(description)
                    self.stats['total_fixes'] += 1
            except re.error as e:
                print(f"⚠️  Error aplicando patrón {pattern}: {e}")
        
        # Normalizar terminaciones de línea
        if '\r\n' in fixed_content:
            fixed_content = fixed_content.replace('\r\n', '\n')
            changes.append('Normalized CRLF to LF')
        
        return fixed_content, changes

    def create_backup(self, file_path: Path) -> Path:
        """Crea un archivo de backup con timestamp."""
        import time
        timestamp = int(time.time())
        backup_path = file_path.with_name(f"{file_path.name}.backup")
        
        # Si ya existe un backup, usar timestamp
        if backup_path.exists():
            backup_path = file_path.with_name(f"{file_path.name}.{timestamp}.backup")
        
        shutil.copy2(file_path, backup_path)
        self.stats['backups_created'] += 1
        return backup_path

    def process_file(self, file_path: Path) -> Dict:
        """Procesa un archivo individual."""
        result = {
            'file': str(file_path.relative_to(self.project_root)),
            'status': 'skipped',
            'changes': [],
            'errors': [],
            'backup_path': None,
            'problems_detected': []
        }
        
        try:
            self.stats['files_processed'] += 1
            
            # Intentar leer el archivo con diferentes codificaciones
            content = None
            for encoding in ['utf-8', 'latin-1', 'cp1252']:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                result['errors'].append('Could not decode file with any encoding')
                self.stats['errors'] += 1
                return result
            
            # Detectar problemas
            problems = self.detect_problems(content, file_path)
            result['problems_detected'] = problems
            
            if not problems:
                result['status'] = 'no_problems'
                return result
            
            # Crear backup antes de modificar
            backup_path = self.create_backup(file_path)
            result['backup_path'] = str(backup_path.relative_to(self.project_root))
            
            # Aplicar correcciones
            fixed_content, changes = self.fix_content(content, file_path)
            
            if fixed_content != content:
                # Escribir archivo corregido
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                
                result['status'] = 'fixed'
                result['changes'] = changes
                self.stats['files_fixed'] += 1
                
                print(f"✅ {file_path.name}")
                for change in changes:
                    print(f"   - {change}")
            else:
                # Si no hubo cambios reales, eliminar backup
                backup_path.unlink()
                result['backup_path'] = None
                result['status'] = 'no_changes_needed'
                self.stats['backups_created'] -= 1
                
        except Exception as e:
            result['errors'].append(str(e))
            result['status'] = 'error'
            self.stats['errors'] += 1
            print(f"❌ Error procesando {file_path.name}: {e}")
        
        return result

    def find_files(self) -> List[Path]:
        """Encuentra archivos que necesitan ser procesados."""
        target_extensions = {'.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.txt'}
        files = []
        
        for file_path in self.project_root.rglob('*'):
            if (file_path.is_file() and 
                not self.should_skip_file(file_path) and 
                (file_path.suffix in target_extensions or file_path.name.startswith('.env'))):
                files.append(file_path)
        
        return sorted(files)

    def run(self) -> Dict:
        """Ejecuta el proceso de corrección."""
        print("🔧 CORRECTOR AVANZADO DE SALTOS DE LÍNEA")
        print("=" * 55)
        print(f"📁 Proyecto: {self.project_root}")
        print()
        
        if not self.project_root.exists():
            print(f"❌ Error: El directorio {self.project_root} no existe")
            return {'success': False, 'error': 'Project directory not found'}
        
        # Encontrar archivos
        files = self.find_files()
        print(f"🔍 Archivos encontrados: {len(files)}")
        print()
        
        # Procesar archivos
        results = []
        for file_path in files:
            result = self.process_file(file_path)
            results.append(result)
        
        # Generar reporte
        self.generate_report(results)
        
        return {
            'success': True,
            'stats': self.stats,
            'results': results
        }

    def generate_report(self, results: List[Dict]):
        """Genera un reporte detallado de los resultados."""
        print("\n" + "=" * 55)
        print("📊 REPORTE DE CORRECCIONES")
        print("=" * 55)
        
        # Estadísticas generales
        print(f"📂 Archivos procesados: {self.stats['files_processed']}")
        print(f"✅ Archivos corregidos: {self.stats['files_fixed']}")
        print(f"💾 Backups creados: {self.stats['backups_created']}")
        print(f"🔧 Total de correcciones: {self.stats['total_fixes']}")
        print(f"❌ Errores: {self.stats['errors']}")
        
        # Archivos corregidos
        fixed_files = [r for r in results if r['status'] == 'fixed']
        if fixed_files:
            print(f"\n🎉 Archivos corregidos exitosamente ({len(fixed_files)}):")
            for result in fixed_files:
                print(f"• {result['file']}")
                for change in result['changes']:
                    print(f"  - {change}")
        
        # Archivos con problemas detectados pero sin cambios
        no_changes = [r for r in results if r['status'] == 'no_changes_needed']
        if no_changes:
            print(f"\n⚠️  Archivos con problemas detectados pero sin cambios ({len(no_changes)}):")
            for result in no_changes:
                print(f"• {result['file']} - {len(result['problems_detected'])} problemas detectados")
        
        # Errores
        error_files = [r for r in results if r['status'] == 'error']
        if error_files:
            print(f"\n❌ Archivos con errores ({len(error_files)}):")
            for result in error_files:
                print(f"• {result['file']}: {'; '.join(result['errors'])}")
        
        # Comandos útiles
        print(f"\n📋 Comandos útiles:")
        print("• Ver cambios específicos:")
        for result in fixed_files:
            if result['backup_path']:
                print(f"  diff '{result['backup_path']}' '{result['file']}'")
        
        print("• Eliminar todos los backups:")
        print("  find . -name '*.backup' -delete")
        
        print("• Probar la aplicación:")
        print("  npm run dev")
        
        # Generar reporte JSON
        report_path = self.project_root / 'newline_fix_report.json'
        with open(report_path, 'w') as f:
            json.dump({
                'timestamp': __import__('datetime').datetime.now().isoformat(),
                'stats': self.stats,
                'results': results
            }, f, indent=2)
        
        print(f"\n📄 Reporte detallado guardado en: {report_path}")
        print("\n🎯 ¡Corrección completada!")

def main():
    """Función principal."""
    project_path = "/Users/rafaelramos/Desktop/ayamas"
    
    # Verificar que el directorio existe
    if not os.path.exists(project_path):
        print(f"❌ Error: El directorio {project_path} no existe")
        print("Verifica la ruta del proyecto ayamas")
        sys.exit(1)
    
    # Cambiar al directorio del proyecto
    os.chdir(project_path)
    
    # Crear instancia del corrector
    fixer = NewlineFixer(project_path)
    
    # Ejecutar corrección
    result = fixer.run()
    
    if result['success']:
        print(f"\n✅ Proceso completado exitosamente")
        if result['stats']['files_fixed'] > 0:
            print(f"🎉 {result['stats']['files_fixed']} archivos fueron corregidos")
        else:
            print("ℹ️  No se encontraron archivos que necesitaran corrección")
    else:
        print(f"\n❌ El proceso falló: {result.get('error', 'Error desconocido')}")
        sys.exit(1)

if __name__ == "__main__":
    main()
