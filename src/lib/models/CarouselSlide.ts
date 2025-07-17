import mongoose, { Schema, Document, Model } from 'mongoose'

// Interfaz para el documento de Slide del Carrusel
export interface ICarouselSlide extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  subtitle?: string
  description: string
  price?: string
  originalPrice?: string
  period?: string
  features: string[]
  icon: string
  backgroundColor: string
  backgroundImage?: string
  backgroundOpacity: number
  badge?: string
  discount?: string
  ctaText: string
  ctaSecondary?: string
  ctaUrl?: string
  ctaSecondaryUrl?: string
  stats?: {
    rating?: number
    clients?: string
  }
  active: boolean
  order: number
  href?: string
  createdAt: Date
  updatedAt: Date
}

// Schema de Mongoose para Slide del Carrusel
const CarouselSlideSchema = new Schema<ICarouselSlide>({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [150, 'El subtítulo no puede exceder 150 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  price: {
    type: String,
    required: false,
    trim: true
  },
  originalPrice: {
    type: String,
    trim: true
  },
  period: {
    type: String,
    required: false,
    default: '/mes'
  },
  features: [{
    type: String,
    required: true,
    trim: true
  }],
  icon: {
    type: String,
    required: [true, 'El icono es obligatorio'],
    trim: true
  },
  backgroundColor: {
    type: String,
    required: [true, 'El color de fondo es obligatorio'],
    default: 'from-blue-600 to-blue-800'
  },
  backgroundImage: {
    type: String,
    trim: true
  },
  backgroundOpacity: {
    type: Number,
    required: true,
    min: [0, 'La opacidad mínima es 0'],
    max: [1, 'La opacidad máxima es 1'],
    default: 0.2
  },
  badge: {
    type: String,
    trim: true
  },
  discount: {
    type: String,
    trim: true
  },
  ctaText: {
    type: String,
    required: [true, 'El texto del CTA principal es obligatorio'],
    default: 'Cotizar Ahora',
    trim: true
  },
  ctaSecondary: {
    type: String,
    required: false,
    default: '',
    trim: true
  },
  ctaUrl: {
    type: String,
    trim: true
  },
  ctaSecondaryUrl: {
    type: String,
    trim: true
  },
  stats: {
    rating: {
      type: Number,
      required: false,
      min: [1, 'La calificación mínima es 1'],
      max: [5, 'La calificación máxima es 5'],
      default: 4.8
    },
    clients: {
      type: String,
      required: false,
      default: '10K+',
      trim: true
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  href: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Índices para optimizar consultas
CarouselSlideSchema.index({ active: 1, order: 1 })
CarouselSlideSchema.index({ order: 1 })

// Middleware pre-save para validaciones adicionales
CarouselSlideSchema.pre('save', function(next) {
  // Validar que al menos tenga una característica
  if (this.features.length === 0) {
    return next(new Error('Debe tener al menos una característica'))
  }
  
  // Limpiar arrays de strings vacíos
  this.features = this.features.filter(feature => feature.trim().length > 0)
  
  // Limitar a máximo 4 características para el carrusel
  if (this.features.length > 4) {
    this.features = this.features.slice(0, 4)
  }
  
  next()
})

// Método estático para obtener slides activos
CarouselSlideSchema.statics.findActive = function() {
  return this.find({ active: true }).sort({ order: 1, createdAt: -1 })
}

// Método estático para reordenar slides
CarouselSlideSchema.statics.reorderSlides = async function(slideIds: string[]) {
  const updates = slideIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { order: index }
    }
  }))
  
  return this.bulkWrite(updates)
}

// Crear el modelo o usar el existente
const CarouselSlide: Model<ICarouselSlide> = mongoose.models?.CarouselSlide || mongoose.model<ICarouselSlide>('CarouselSlide', CarouselSlideSchema)

export default CarouselSlide
