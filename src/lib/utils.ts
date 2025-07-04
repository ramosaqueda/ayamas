import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'CLP'): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatPhone(phone: string): string {
  // Format Chilean phone numbers
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{1,2})(\d{1,4})(\d{1,4})$/)
  
  if (match) {
    return `+56 ${match[1]} ${match[2]} ${match[3]}`
  }
  
  return phone
}

export function validateRUT(rut: string): boolean {
  // Simple RUT validation for Chilean identification
  const cleanRUT = rut.replace(/[^0-9kK]/g, '')
  
  if (cleanRUT.length < 8 || cleanRUT.length > 9) {
    return false
  }
  
  const body = cleanRUT.slice(0, -1)
  const dv = cleanRUT.slice(-1).toUpperCase()
  
  let sum = 0
  let multiplier = 2
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  
  const remainder = sum % 11
  const calculatedDV = remainder < 2 ? remainder.toString() : remainder === 10 ? 'K' : (11 - remainder).toString()
  
  return calculatedDV === dv
}

export function generateQuoteId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substr(2, 5)
  return `COT-${timestamp}-${randomStr}`.toUpperCase()
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function scrollToElement(elementId: string, offset: number = 80): void {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}

export function getInsuranceIcon(type: string): string {
  const icons: Record<string, string> = {
    auto: '🚗',
    hogar: '🏠',
    vida: '❤️',
    salud: '🏥',
    viaje: '✈️',
    empresarial: '🏢',
    default: '🛡️'
  }
  
  return icons[type] || icons.default
}

export function calculateAge(birthDate: Date): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+?56)?[2-9]\d{8}$/
  const cleaned = phone.replace(/\D/g, '')
  return phoneRegex.test(cleaned)
}

export function sanitizeString(str: string): string {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
