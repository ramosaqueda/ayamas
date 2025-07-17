#!/bin/bash

echo "🚀 Iniciando migración de categorías..."
echo "📂 Directorio actual: $(pwd)"

# Verificar si estamos en el directorio correcto
if [ ! -f "src/scripts/migrate-categories.ts" ]; then
    echo "❌ Error: No se encontró el archivo de migración"
    echo "   Asegúrate de estar en el directorio raíz del proyecto Ayamas"
    exit 1
fi

# Verificar si existe node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Ejecutar migración
echo "🔄 Ejecutando migración..."
npx tsx src/scripts/migrate-categories.ts

echo "✅ Migración completada"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Inicia el servidor: npm run dev"
echo "   2. Visita: http://localhost:3000/admin/categories"
echo "   3. Verifica que las categorías se carguen correctamente"
echo "   4. Prueba crear/editar productos"
echo ""
echo "🔄 Si necesitas revertir la migración:"
echo "   ./migrate-categories.sh rollback"
