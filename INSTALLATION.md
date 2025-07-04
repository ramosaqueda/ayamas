# 🚀 Instrucciones de Instalación - Ayamas Seguros

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm**, **yarn** o **pnpm**
- **Git**

## Instalación Paso a Paso

### 1. Preparación del Entorno

```bash
# Verificar versiones
node --version  # Debe ser 18+
npm --version
```

### 2. Instalación de Dependencias

```bash
# Navegar al directorio del proyecto
cd ayamas

# Instalar dependencias
npm install
```

### 3. Configuración del Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar variables de entorno
nano .env.local
```

### 4. Ejecutar el Proyecto

```bash
# Modo desarrollo
npm run dev

# El sitio estará disponible en http://localhost:3000
```

## Comandos Principales

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Ejecutar en producción
npm run start

# Linting
npm run lint

# Verificar tipos TypeScript
npm run type-check
```

## Estructura de Archivos Clave

```
ayamas/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Layout principal con metadatos SEO
│   │   └── page.tsx        # Página de inicio
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx  # Navegación principal
│   │   │   └── Footer.tsx  # Pie de página
│   │   ├── sections/
│   │   │   ├── Hero.tsx    # Sección principal
│   │   │   ├── Stats.tsx   # Estadísticas animadas
│   │   │   ├── Products.tsx # Catálogo de productos
│   │   │   └── Testimonials.tsx # Testimonios
│   │   └── ui/
│   │       ├── QuoteForm.tsx # Formulario de cotización
│   │       ├── FloatingChat.tsx # Chat interactivo
│   │       ├── Button.tsx  # Botones reutilizables
│   │       ├── Card.tsx    # Tarjetas
│   │       ├── Modal.tsx   # Ventanas modales
│   │       ├── Loading.tsx # Indicadores de carga
│   │       └── Toast.tsx   # Notificaciones
│   ├── hooks/
│   │   └── index.ts        # Hooks personalizados
│   ├── lib/
│   │   ├── constants.ts    # Constantes de la aplicación
│   │   ├── types.ts        # Tipos TypeScript
│   │   └── utils.ts        # Funciones utilitarias
│   └── styles/
│       └── globals.css     # Estilos globales
├── public/                 # Archivos estáticos
├── tailwind.config.js      # Configuración Tailwind
├── tsconfig.json          # Configuración TypeScript
└── package.json           # Dependencias
```

## Personalización

### Colores Corporativos

Edita `tailwind.config.js` para cambiar la paleta de colores:

```javascript
colors: {
  primary: {
    500: '#DC143C', // Rojo principal
    600: '#B22222', // Rojo secundario
    700: '#8B0000', // Rojo oscuro
  },
  secondary: {
    500: '#FFD700', // Dorado
  }
}
```

### Contenido

- **Información de la empresa**: `src/lib/constants.ts`
- **Textos de secciones**: Componentes en `src/components/sections/`
- **Formularios**: `src/components/ui/QuoteForm.tsx`
- **Chat**: `src/components/ui/FloatingChat.tsx`

### Estilos

- **Estilos globales**: `src/styles/globals.css`
- **Componentes**: Cada componente tiene sus estilos Tailwind
- **Animaciones**: Configuradas en `tailwind.config.js`

## Funcionalidades Implementadas

### ✅ Completadas

- [x] Diseño responsive completo
- [x] Navegación con menú móvil
- [x] Hero section con formulario de cotización
- [x] Sección de estadísticas animadas
- [x] Catálogo de productos interactivo
- [x] Testimonios con slider automático
- [x] Footer completo con enlaces
- [x] Chat flotante con respuestas automáticas
- [x] Validación de formularios
- [x] Animaciones CSS/Framer Motion
- [x] Optimización SEO
- [x] TypeScript completo
- [x] Hooks personalizados
- [x] Componentes reutilizables

### 🔄 Por Implementar (Opcional)

- [ ] Integración con API de email
- [ ] Base de datos para cotizaciones
- [ ] Panel de administración
- [ ] Sistema de usuarios
- [ ] Integración con CRM
- [ ] Analíticas avanzadas
- [ ] PWA (Progressive Web App)
- [ ] Pruebas unitarias
- [ ] Pruebas E2E

## Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar dominio personalizado en el dashboard
```

### Netlify

```bash
# Build
npm run build

# Subir carpeta .next a Netlify
```

### Docker

```bash
# Crear imagen
docker build -t ayamas-seguros .

# Ejecutar contenedor
docker run -p 3000:3000 ayamas-seguros
```

## Troubleshooting

### Problemas Comunes

1. **Error de dependencias**:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Problemas de TypeScript**:
```bash
npm run type-check
```

3. **Errores de linting**:
```bash
npm run lint --fix
```

4. **Problemas de estilos**:
```bash
# Verificar configuración de Tailwind
npm run dev
```

### Soporte

Si encuentras problemas:

1. Revisa los logs en la consola
2. Verifica las variables de entorno
3. Comprueba la versión de Node.js
4. Consulta la documentación de Next.js

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## Recursos Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

¡El proyecto está listo para ser usado! 🎉
