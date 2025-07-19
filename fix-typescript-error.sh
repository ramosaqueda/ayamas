#!/bin/bash

echo "🔧 Solucionando error de TypeScript en el proyecto Ayamas..."

# Navegar al directorio del proyecto
cd /Users/rafaelramos/Desktop/ayamas

# Limpiar caché de Next.js
echo "🧹 Limpiando caché de Next.js..."
rm -rf .next

# Limpiar caché de TypeScript
echo "🧹 Limpiando caché de TypeScript..."
rm -rf .tsbuildinfo

# Reinstalar dependencias si es necesario
echo "📦 Verificando dependencias..."
npm install

# Intentar compilar
echo "🔨 Compilando proyecto..."
npm run build

echo "✅ Proceso completado. Si el error persiste, revisa el archivo manualmente."
