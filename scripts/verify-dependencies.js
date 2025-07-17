/**
 * Script para verificar que todas las dependencias están instaladas correctamente
 */

console.log('🔍 Verificando dependencias de la Fase 2...\n')

const dependencies = [
  { name: 'mongoose', package: 'mongoose' },
  { name: 'Next.js', package: 'next' },
  { name: 'React', package: 'react' },
  { name: 'Framer Motion', package: 'framer-motion' },
  { name: 'Lucide React', package: 'lucide-react' },
  { name: 'TypeScript', package: 'typescript' }
]

let allInstalled = true

dependencies.forEach(({ name, package: pkg }) => {
  try {
    require(pkg)
    console.log(`✅ ${name} - OK`)
  } catch (error) {
    console.log(`❌ ${name} - NO INSTALADO`)
    allInstalled = false
  }
})

console.log('\n' + '='.repeat(50))

if (allInstalled) {
  console.log('🎉 ¡Todas las dependencias están instaladas correctamente!')
  console.log('\n📋 Próximos pasos:')
  console.log('   1. Configurar variables de entorno (.env.local)')
  console.log('   2. Ejecutar: npm run seed')
  console.log('   3. Ejecutar: npm run dev')
} else {
  console.log('⚠️  Faltan dependencias por instalar')
  console.log('\n🔧 Ejecuta: npm install')
}

console.log('\n📚 Ver FASE2-DATABASE-README.md para más detalles')
