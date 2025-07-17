import mongoose, { Schema, Document, Model } from 'mongoose'

// Interfaz para el documento de Categoría
export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
  description?: string
  active: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

// Schema de Mongoose para Categoría
const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  slug: {
    type: String,
    required: [true, 'El slug es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [50, 'El slug no puede exceder 50 caracteres'],
    match: [/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Índices para optimizar consultas
CategorySchema.index({ slug: 1 })
CategorySchema.index({ active: 1, order: 1 })

// Middleware pre-save para generar slug automáticamente si no existe
CategorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  next()
})

// Método estático para obtener categorías activas
CategorySchema.statics.findActive = function() {
  return this.find({ active: true }).sort({ order: 1, name: 1 })
}

// Método estático para obtener categoría por slug
CategorySchema.statics.findBySlug = function(slug: string) {
  return this.findOne({ slug, active: true })
}

// Crear el modelo o usar el existente
const Category: Model<ICategory> = mongoose.models?.Category || mongoose.model<ICategory>('Category', CategorySchema)

export default Category
