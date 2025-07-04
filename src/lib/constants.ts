export const INSURANCE_TYPES = {
  AUTO: 'auto',
  HOGAR: 'hogar',
  VIDA: 'vida',
  SALUD: 'salud',
  VIAJE: 'viaje',
  EMPRESARIAL: 'empresarial',
} as const

export const INSURANCE_LABELS = {
  [INSURANCE_TYPES.AUTO]: 'Seguro Automotriz',
  [INSURANCE_TYPES.HOGAR]: 'Seguro de Hogar',
  [INSURANCE_TYPES.VIDA]: 'Seguro de Vida',
  [INSURANCE_TYPES.SALUD]: 'Seguro de Salud',
  [INSURANCE_TYPES.VIAJE]: 'Seguro de Viaje',
  [INSURANCE_TYPES.EMPRESARIAL]: 'Seguro Empresarial',
} as const

export const COVERAGE_LEVELS = {
  BASICA: 'basica',
  INTERMEDIA: 'intermedia',
  COMPLETA: 'completa',
  PREMIUM: 'premium',
} as const

export const COVERAGE_LABELS = {
  [COVERAGE_LEVELS.BASICA]: 'Básica',
  [COVERAGE_LEVELS.INTERMEDIA]: 'Intermedia',
  [COVERAGE_LEVELS.COMPLETA]: 'Completa',
  [COVERAGE_LEVELS.PREMIUM]: 'Premium',
} as const

export const QUOTE_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
} as const

export const CONTACT_METHODS = {
  PHONE: 'phone',
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  CHAT: 'chat',
} as const

export const COMPANY_INFO = {
  name: 'A&A+ Seguros',
  slogan: 'Tu Protección, Nuestro Compromiso',
  phone: '600 123 4567',
  email: 'contacto@segurosayamas.cl',
  address: 'Av. Providencia 123, La Serena,Chile',
  website: 'https://ayamasseguros.cl',
  socialMedia: {
    facebook: 'https://facebook.com/ayamasseguros',
    instagram: 'https://instagram.com/ayamasseguros',
    linkedin: 'https://linkedin.com/company/ayamasseguros',
    youtube: 'https://youtube.com/ayamasseguros',
  },
  businessHours: {
    monday: '8:00 - 18:00',
    tuesday: '8:00 - 18:00',
    wednesday: '8:00 - 18:00',
    thursday: '8:00 - 18:00',
    friday: '8:00 - 18:00',
    saturday: 'Cerrado',
    sunday: 'Cerrado',
  },
} as const

export const CHILEAN_REGIONS = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Región Metropolitana',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
] as const

export const VEHICLE_BRANDS = [
  'Toyota',
  'Chevrolet',
  'Nissan',
  'Hyundai',
  'Kia',
  'Mazda',
  'Honda',
  'Suzuki',
  'Volkswagen',
  'Ford',
  'Peugeot',
  'Renault',
  'Citroën',
  'Mitsubishi',
  'Subaru',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volvo',
  'Otro',
] as const

export const PROPERTY_TYPES = [
  'Casa',
  'Departamento',
  'Oficina',
  'Local Comercial',
  'Bodega',
  'Otro',
] as const

export const CURRENCY = {
  symbol: '$',
  code: 'CLP',
  name: 'Peso Chileno',
} as const

export const DATE_FORMATS = {
  short: 'dd/MM/yyyy',
  medium: 'dd MMM yyyy',
  long: 'dd MMMM yyyy',
  full: 'EEEE, dd MMMM yyyy',
} as const

export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    pattern: /^(\+?56)?[2-9]\d{8}$/,
  },
  rut: {
    pattern: /^[0-9]+[-|‐]{1}[0-9kK]{1}$/,
  },
} as const

export const API_ENDPOINTS = {
  quotes: '/api/quotes',
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  claims: '/api/claims',
  auth: '/api/auth',
} as const

export const STORAGE_KEYS = {
  theme: 'ayamas-theme',
  language: 'ayamas-language',
  userPreferences: 'ayamas-user-preferences',
  quoteData: 'ayamas-quote-data',
} as const

export const ERROR_MESSAGES = {
  generic: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
  network: 'Error de conexión. Verifica tu conexión a internet.',
  validation: 'Por favor, verifica los datos ingresados.',
  required: 'Este campo es obligatorio.',
  email: 'Por favor, ingresa un email válido.',
  phone: 'Por favor, ingresa un teléfono válido.',
  rut: 'Por favor, ingresa un RUT válido.',
  minLength: 'Este campo debe tener al menos {min} caracteres.',
  maxLength: 'Este campo no puede tener más de {max} caracteres.',
} as const

export const SUCCESS_MESSAGES = {
  quoteSubmitted:
    'Tu cotización ha sido enviada exitosamente. Te contactaremos pronto.',
  contactSubmitted:
    'Tu mensaje ha sido enviado. Te responderemos a la brevedad.',
  newsletterSubscribed: 'Te has suscrito exitosamente a nuestro newsletter.',
  dataUpdated: 'Tus datos han sido actualizados correctamente.',
} as const
