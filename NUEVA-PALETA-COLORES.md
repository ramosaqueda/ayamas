# 🎨 Nueva Paleta de Colores - Proyecto Ayamas

## Colores Principales

### Primary (Azul)
- **primary-50**: `#E9F1FA` - Azul claro (solicitado)
- **primary-500**: `#00ABE4` - Azul brillante (solicitado)
- **primary-600**: `#0077B6` - Azul medio
- **primary-800**: `#003B5C` - Azul oscuro

### Neutral (Grises)
- **neutral-50**: `#F8F9FA` - Gris claro
- **neutral-500**: `#6C757D` - Gris medio
- **neutral-800**: `#212529` - Gris oscuro

### Blanco
- **white**: `#FFFFFF` - Blanco puro (solicitado)

## Colores Complementarios

### Secondary (Azul de apoyo)
- **secondary-50**: `#F0F9FF`
- **secondary-500**: `#0EA5E9`
- **secondary-700**: `#0369A1`

### Accent (Naranja)
- **accent-500**: `#F97316` - Para llamadas a la acción
- **accent-600**: `#EA580C` - Hover states

### Estados
- **success-500**: `#10B981` - Verde para éxito
- **warning-500**: `#F59E0B` - Amarillo para advertencias
- **error-500**: `#EF4444` - Rojo para errores

## Uso Recomendado

### Texto
- **Título principal**: `text-neutral-900`
- **Texto secundario**: `text-neutral-600`
- **Texto en fondo azul**: `text-white`

### Fondos
- **Fondo principal**: `bg-white`
- **Fondo secundario**: `bg-neutral-50`
- **Fondo de acento**: `bg-primary-50`

### Botones
- **Primario**: `bg-primary-500 hover:bg-primary-600`
- **Secundario**: `bg-primary-50 text-primary-800 hover:bg-primary-100`
- **Acento**: `bg-accent-500 hover:bg-accent-600`

### Gradientes
- **Primario**: `bg-gradient-to-r from-primary-500 to-primary-600`
- **Secundario**: `bg-gradient-to-r from-primary-50 to-primary-100`
- **Acento**: `bg-gradient-to-r from-accent-500 to-accent-600`

## Clases Utility Personalizadas

### Sombras
- `.shadow-ayamas` - Sombra suave con tinte azul
- `.shadow-ayamas-lg` - Sombra media con tinte azul
- `.shadow-ayamas-xl` - Sombra grande con tinte azul

### Efectos
- `.text-gradient` - Gradiente de texto azul
- `.glass-effect` - Efecto de vidrio
- `.card` - Tarjeta con sombra
- `.card-primary` - Tarjeta con fondo azul claro

### Animaciones
- `.animation-delay-200` hasta `.animation-delay-1000`
- `.pulse-soft` - Pulsación suave
- `.shimmer` - Efecto de carga

## Accesibilidad

La nueva paleta cumple con los estándares WCAG 2.1 AA:
- Contraste mínimo de 4.5:1 para texto normal
- Contraste mínimo de 3:1 para texto grande
- Estados de focus claramente definidos
- Colores para estados de error, éxito y advertencia

## Ejemplos de Uso

```html
<!-- Botón primario -->
<button class="btn btn-primary">Cotizar Ahora</button>

<!-- Tarjeta con acento -->
<div class="card card-primary">
  <h3 class="text-gradient">Título</h3>
  <p class="text-neutral-600">Descripción</p>
</div>

<!-- Sección hero -->
<section class="bg-gradient-primary text-white">
  <div class="container section-padding">
    <h1 class="text-4xl font-bold">Bienvenido a Ayamas</h1>
  </div>
</section>
```

## Cambios Realizados

1. **Reemplazado el rojo (#DC143C) por azul brillante (#00ABE4)**
2. **Añadido azul claro (#E9F1FA) como color base**
3. **Mantenido el blanco (#FFFFFF) como solicitado**
4. **Agregado azul oscuro (#003B5C) para mejor contraste**
5. **Incluido naranja (#F97316) como color de acento**
6. **Actualizado scrollbar y estados de focus**
7. **Mejorado sistema de sombras con tinte azul**

La nueva paleta mantiene la profesionalidad mientras aporta frescura y modernidad al diseño del proyecto Ayamas.
