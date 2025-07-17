#!/bin/bash

echo "🔧 Instalando dependencias para la Fase 2..."

# Instalar dependencias principales
npm install mongoose@^8.0.3

# Instalar dependencias de desarrollo  
npm install --save-dev tsx@^4.7.0

echo "✅ Dependencias instaladas correctamente"

# Verificar instalación
echo "📦 Verificando instalación de mongoose..."
node -e "try { require('mongoose'); console.log('✅ Mongoose instalado correctamente'); } catch(e) { console.log('❌ Error:', e.message); }"

echo "🎉 ¡Listo! Ahora puedes ejecutar:"
echo "   npm run dev"
echo "   npm run seed"
