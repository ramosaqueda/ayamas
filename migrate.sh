#!/bin/bash

if [ "$1" = "rollback" ]; then
    echo "🔄 Iniciando rollback de migración..."
    npx tsx src/scripts/migrate-categories.ts --rollback
else
    echo "🚀 Iniciando migración de categorías..."
    npx tsx src/scripts/migrate-categories.ts
fi
