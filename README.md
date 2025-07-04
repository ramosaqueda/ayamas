# Ayamas Seguros - Sitio Web Oficial

Un sitio web moderno y funcional para la empresa de seguros A&A+ Seguros (Ayamas), construido con Next.js 14, TypeScript
y Tailwind CSS.

## 🚀 Características

- **Diseño Moderno**: Interfaz atractiva con paleta de colores basada en rojo corporativo
- **Responsive**: Completamente adaptable a todos los dispositivos
- **Optimizado para SEO**: Metadatos completos y estructura semántica
- **Formulario de Cotización**: Sistema interactivo para solicitar cotizaciones
- **Chat en Vivo**: Asistente virtual con respuestas automáticas
- **Testimonios**: Slider automático con testimonios de clientes
- **Animaciones**: Efectos visuales atractivos con Framer Motion
- **Accesibilidad**: Cumple con estándares de accesibilidad web
- **TypeScript**: Tipado estático para mejor desarrollo
- **Componentes Reutilizables**: Arquitectura modular y escalable

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Tipografía**: Poppins (Google Fonts)
- **Linting**: ESLint + Prettier

## 📦 Instalación

1. **Clona el repositorio**:

```bash
git clone https://github.com/tu-usuario/ayamas-seguros.git
cd ayamas-seguros
```

2. **Instala las dependencias**:

```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Ejecuta el servidor de desarrollo**:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

4. **Abre el navegador**: Visita [http://localhost:3000](http://localhost:3000) para ver el sitio.

## 🏗️ Estructura del Proyecto

```
ayamas/
├── src/
│   ├── app/                 # App Router de Next.js
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página de inicio
│   ├── components/          # Componentes React
│   │   ├── layout/          # Componentes de layout
│   │   ├── sections/        # Secciones de la página
│   │   └── ui/              # Componentes UI reutilizables
│   ├── hooks/               # Hooks personalizados
│   ├── lib/                 # Utilidades y configuraciones
│   └── styles/              # Estilos globales
├── public/                  # Archivos estáticos
├── tailwind.config.js       # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── package.json            # Dependencias del proyecto
```

## 🎨 Paleta de Colores

El diseño utiliza una paleta de colores basada en rojo corporativo:

- **Rojo Primario**: `#DC143C` (Crimson)
- **Rojo Secundario**: `#B22222` (Fire Brick)
- **Rojo Oscuro**: `#8B0000` (Dark Red)
- **Dorado**: `#FFD700` (Gold)
- **Neutros**: Escala de grises para texto y fondos

## 🧩 Componentes Principales

### Layout

- **Header**: Navegación principal con logo y menú responsive
- **Footer**: Información de contacto, enlaces y redes sociales

### Secciones

- **Hero**: Sección principal con formulario de cotización
- **Stats**: Estadísticas de la empresa con animaciones
- **Products**: Catálogo de productos de seguros
- **Testimonials**: Testimonios de clientes con slider

### UI Components

- **QuoteForm**: Formulario de cotización con validación
- **FloatingChat**: Chat flotante con respuestas automáticas
- **Button**: Botones reutilizables con variantes
- **Card**: Tarjetas con diferentes estilos
- **Modal**: Ventanas modales
- **Loading**: Indicadores de carga
- **Toast**: Notificaciones

## 📱 Funcionalidades

### Formulario de Cotización

- Validación en tiempo real
- Diferentes tipos de seguros
- Envío por email
- Almacenamiento local temporal

### Chat Interactivo

- Respuestas automáticas
- Botones de acceso rápido
- Simulación de escritura
- Información de contacto

### Optimizaciones

- Lazy loading de imágenes
- Compresión de assets
- Minificación de CSS/JS
- Carga diferida de componentes

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_SITE_URL=https://ayamasseguros.cl
NEXT_PUBLIC_CONTACT_EMAIL=contacto@segurosayamas.cl
NEXT_PUBLIC_CONTACT_PHONE=600123456
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
```

### Personalización

- Colores: Modifica `tailwind.config.js`
- Tipografía: Cambia fuentes en `layout.tsx`
- Contenido: Edita los archivos de componentes
- Estilos: Personaliza `globals.css`

## 🚀 Deployment

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Sube la carpeta .next/static a Netlify
```

### Docker

```bash
docker build -t ayamas-seguros .
docker run -p 3000:3000 ayamas-seguros
```

## 📊 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🔍 SEO

- Meta tags optimizados
- Sitemap automático
- Robots.txt configurado
- Schema.org markup
- Open Graph tags
- Twitter Cards

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Coverage
npm run test:coverage

# E2E testing
npm run test:e2e
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción
npm run start        # Producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**A&A+ Seguros**

- Email: contacto@segurosayamas.cl
- Teléfono: 600 123 4567
- Sitio Web: https://ayamasseguros.cl

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [Tailwind CSS](https://tailwindcss.com/) por los estilos
- [Lucide](https://lucide.dev/) por los iconos
- [Vercel](https://vercel.com/) por el hosting

---

Desarrollado con ❤️ para A&A+ Seguros
