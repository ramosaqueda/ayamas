export interface QuoteFormData {
  // Personal Information
  tipoSeguro: string
  nombre: string
  apellido?: string
  email: string
  telefono: string
  rut?: string
  edad?: number
  region?: string
  comuna?: string
  
  // Auto Insurance Specific
  marcaVehiculo?: string
  modeloVehiculo?: string
  anoVehiculo?: number
  valorVehiculo?: number
  usoVehiculo?: 'particular' | 'comercial' | 'taxi' | 'uber'
  
  // Home Insurance Specific
  tipoPropiedad?: string
  valorPropiedad?: number
  metrosCuadrados?: number
  antiguedadPropiedad?: number
  
  // Life Insurance Specific
  montoCobertura?: number
  beneficiarios?: string
  estadoSalud?: 'excelente' | 'bueno' | 'regular' | 'malo'
  
  // Health Insurance Specific
  planSalud?: string
  preexistencias?: boolean
  numeroPersonas?: number
  
  // Travel Insurance Specific
  destino?: string
  fechaViaje?: string
  duracionViaje?: number
  tipoViaje?: 'turistico' | 'negocios' | 'estudio' | 'otro'
  
  // Business Insurance Specific
  giroEmpresa?: string
  numeroEmpleados?: number
  ventasAnuales?: number
  
  // Additional Information
  nivelCobertura?: 'basica' | 'intermedia' | 'completa' | 'premium'
  deducible?: number
  mensaje?: string
  metodoPago?: 'mensual' | 'trimestral' | 'semestral' | 'anual'
  
  // Metadata
  source?: string
  campaign?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Quote {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'expired'
  formData: QuoteFormData
  calculations?: QuoteCalculation
  validUntil: Date
  createdAt: Date
  updatedAt: Date
}

export interface QuoteCalculation {
  basePremium: number
  discounts: QuoteDiscount[]
  surcharges: QuoteSurcharge[]
  taxes: number
  totalPremium: number
  monthlyPremium: number
  paymentOptions: PaymentOption[]
}

export interface QuoteDiscount {
  type: string
  description: string
  amount: number
  percentage: number
}

export interface QuoteSurcharge {
  type: string
  description: string
  amount: number
  percentage: number
}

export interface PaymentOption {
  frequency: 'monthly' | 'quarterly' | 'biannual' | 'annual'
  amount: number
  discount?: number
  total: number
}

export interface InsuranceProduct {
  id: string
  type: string
  name: string
  description: string
  shortDescription: string
  icon: string
  features: string[]
  coverage: Coverage[]
  exclusions: string[]
  startingPrice: number
  popular: boolean
  category: string
  targetAudience: string[]
  benefits: string[]
  requirements: string[]
  documents: string[]
}

export interface Coverage {
  name: string
  description: string
  limit?: number
  deductible?: number
  included: boolean
  optional?: boolean
}

export interface Testimonial {
  id: string
  name: string
  location: string
  avatar: string
  rating: number
  text: string
  product: string
  date: string
  verified: boolean
}

export interface ContactForm {
  nombre: string
  email: string
  telefono: string
  asunto: string
  mensaje: string
  tipo: 'consulta' | 'reclamo' | 'sugerencia' | 'otro'
  urgente?: boolean
}

export interface NewsletterSubscription {
  email: string
  nombre?: string
  intereses?: string[]
  frecuencia?: 'weekly' | 'monthly'
  subscribeDate: Date
  active: boolean
}

export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono: string
  rut?: string
  fechaNacimiento?: Date
  direccion?: Address
  preferences?: UserPreferences
  policies?: Policy[]
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  calle: string
  numero: string
  depto?: string
  comuna: string
  region: string
  codigoPostal?: string
  pais: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'es' | 'en'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  marketing: {
    email: boolean
    sms: boolean
  }
}

export interface Policy {
  id: string
  number: string
  type: string
  status: 'active' | 'suspended' | 'cancelled' | 'expired'
  startDate: Date
  endDate: Date
  premium: number
  coverage: Coverage[]
  beneficiaries?: Beneficiary[]
  documents: Document[]
  claims?: Claim[]
}

export interface Beneficiary {
  nombre: string
  apellido: string
  rut: string
  relacion: string
  porcentaje: number
  fechaNacimiento: Date
  telefono?: string
  email?: string
}

export interface Document {
  id: string
  type: string
  name: string
  url: string
  uploadDate: Date
  size: number
  mimeType: string
}

export interface Claim {
  id: string
  number: string
  policyId: string
  type: string
  status: 'reported' | 'in_review' | 'approved' | 'rejected' | 'paid'
  amount: number
  description: string
  incidentDate: Date
  reportDate: Date
  documents: Document[]
  updates: ClaimUpdate[]
}

export interface ClaimUpdate {
  id: string
  status: string
  description: string
  date: Date
  user: string
}

export interface Agent {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  especialidad: string[]
  region: string
  experiencia: number
  certificaciones: string[]
  calificacion: number
  avatar?: string
  biografia?: string
  disponible: boolean
}

export interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'agent'
  text: string
  timestamp: Date
  read: boolean
  attachments?: ChatAttachment[]
}

export interface ChatAttachment {
  id: string
  type: 'image' | 'document' | 'link'
  url: string
  name: string
  size?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: Date
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface FormError {
  field: string
  message: string
  code?: string
}

export interface ValidationResult {
  valid: boolean
  errors: FormError[]
}

export interface Theme {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  error: string
  warning: string
  success: string
  info: string
}

export interface SEOData {
  title: string
  description: string
  keywords: string[]
  image?: string
  url?: string
  type?: string
  author?: string
  publishedTime?: Date
  modifiedTime?: Date
}

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

export interface NavigationItem {
  label: string
  href: string
  icon?: string
  children?: NavigationItem[]
  external?: boolean
  badge?: string
}

export interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  properties?: Record<string, any>
}

export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  errorRate: number
  userSatisfaction: number
}

export type InsuranceType = 'auto' | 'hogar' | 'vida' | 'salud' | 'viaje' | 'empresarial'
export type CoverageLevel = 'basica' | 'intermedia' | 'completa' | 'premium'
export type QuoteStatus = 'pending' | 'processing' | 'completed' | 'expired'
export type PaymentFrequency = 'monthly' | 'quarterly' | 'biannual' | 'annual'
export type ContactMethod = 'phone' | 'email' | 'whatsapp' | 'chat'
export type NotificationType = 'info' | 'success' | 'warning' | 'error'
