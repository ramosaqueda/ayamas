import mongoose, { Schema, Document, Model } from 'mongoose'

// Interfaz para el documento de Noticia
export interface INews extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  subtitle?: string
  description: string
  content?: string
  image: string
  author: string
  category: 'regulaciones' | 'consejos' | 'tecnologia' | 'empresa' | 'general'
  readTime: string
  featured: boolean
  active: boolean
  published: boolean
  publishedAt?: Date
  slug: string
  tags: string[]
  href?: string
  seoTitle?: string
  seoDescription?: string
  createdAt: Date
  updatedAt: Date
}

// Schema de Mongoose para Noticia
const NewsSchema = new Schema<INews>({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [250, 'El subtítulo no puede exceder 250 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  content: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: false,
    trim: true,
    default: '/images/default-news.svg'
  },
  author: {
    type: String,
    required: [true, 'El autor es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre del autor no puede exceder 100 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['regulaciones', 'consejos', 'tecnologia', 'empresa', 'general'],
      message: 'Categoría no válida'
    }
  },
  readTime: {
    type: String,
    required: [true, 'El tiempo de lectura es obligatorio'],
    default: '5 min',
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  slug: {
    type: String,
    required: [true, 'El slug es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  href: {
    type: String,
    trim: true
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'El título SEO no puede exceder 60 caracteres']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'La descripción SEO no puede exceder 160 caracteres']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Índices para optimizar consultas
NewsSchema.index({ category: 1, published: 1, active: 1 })
NewsSchema.index({ featured: 1, published: 1, active: 1 })
NewsSchema.index({ published: 1, publishedAt: -1 })
NewsSchema.index({ slug: 1 })
NewsSchema.index({ tags: 1 })

// Virtual para la URL completa
NewsSchema.virtual('fullUrl').get(function() {
  return this.href || `/noticias/${this.slug}`
})

// Middleware pre-save para generar slug automáticamente
NewsSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  
  // Auto-generar publishedAt si se publica por primera vez
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  
  // Auto-generar SEO si no existe
  if (!this.seoTitle) {
    this.seoTitle = this.title.slice(0, 60)
  }
  
  if (!this.seoDescription) {
    this.seoDescription = this.description.slice(0, 160)
  }
  
  // Asignar imagen por defecto si no existe
  if (!this.image || this.image.trim() === '') {
    this.image = '/images/default-news.svg'
  }
  
  next()
})

// Método estático para obtener noticias por categoría
NewsSchema.statics.findByCategory = function(category: string) {
  return this.find({ 
    category, 
    published: true, 
    active: true 
  }).sort({ publishedAt: -1 })
}

// Método estático para obtener noticias destacadas
NewsSchema.statics.findFeatured = function() {
  return this.find({ 
    featured: true, 
    published: true, 
    active: true 
  }).sort({ publishedAt: -1 })
}

// Método estático para buscar noticias
NewsSchema.statics.search = function(query: string) {
  return this.find({
    $and: [
      { published: true, active: true },
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  }).sort({ publishedAt: -1 })
}

// Crear el modelo o usar el existente
const News: Model<INews> = mongoose.models?.News || mongoose.model<INews>('News', NewsSchema)

export default News
