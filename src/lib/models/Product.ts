import mongoose, { Schema, Document, Model, PopulatedDoc } from 'mongoose'
import { ICategory } from './Category'

// Interfaz para el documento de Producto
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  subtitle?: string
  description: string
  price: string
  originalPrice?: string
  period: string
  features: string[]
  icon: string
  color: string
  category: PopulatedDoc<ICategory>
  popular: boolean
  featured: boolean
  active: boolean
  order: number
  badge?: string
  discount?: string
  href?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

// Interfaz para los métodos estáticos del modelo
interface IProductModel extends Model<IProduct> {
  findByCategory(categoryId: string): any
  findFeatured(): any
  findPopular(): any
}

// Schema de Mongoose para Producto
const ProductSchema = new Schema<IProduct>({
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
    required: [true, 'El precio es obligatorio'],
    trim: true
  },
  originalPrice: {
    type: String,
    trim: true
  },
  period: {
    type: String,
    required: [true, 'El período es obligatorio'],
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
  color: {
    type: String,
    required: [true, 'El color es obligatorio'],
    default: 'from-blue-500 to-blue-600'
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es obligatoria']
  },
  popular: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  badge: {
    type: String,
    trim: true
  },
  discount: {
    type: String,
    trim: true
  },
  href: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Índices para optimizar consultas
ProductSchema.index({ category: 1, active: 1 })
ProductSchema.index({ featured: 1, active: 1 })
ProductSchema.index({ popular: 1, active: 1 })
ProductSchema.index({ order: 1 })

// Middleware pre-save para validaciones adicionales
ProductSchema.pre('save', function(next) {
  // Validar que al menos tenga una característica
  if (this.features.length === 0) {
    return next(new Error('Debe tener al menos una característica'))
  }
  
  // Limpiar arrays de strings vacíos
  this.features = this.features.filter((feature: string) => feature.trim().length > 0)
  
  next()
})

// Método estático para obtener productos por categoría
ProductSchema.statics.findByCategory = function(categoryId: string) {
  return this.find({ category: categoryId, active: true })
    .populate('category')
    .sort({ order: 1, createdAt: -1 })
}

// Método estático para obtener productos destacados
ProductSchema.statics.findFeatured = function() {
  return this.find({ featured: true, active: true })
    .populate('category')
    .sort({ order: 1, createdAt: -1 })
}

// Método estático para obtener productos populares
ProductSchema.statics.findPopular = function() {
  return this.find({ popular: true, active: true })
    .populate('category')
    .sort({ order: 1, createdAt: -1 })
}

// Crear el modelo o usar el existente
const Product: IProductModel = mongoose.models?.Product || mongoose.model<IProduct, IProductModel>('Product', ProductSchema)

export default Product
