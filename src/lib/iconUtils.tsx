import { 
  Car, 
  Building, 
  Home, 
  Heart, 
  Sailboat, 
  Stethoscope, 
  Plane, 
  Building2, 
  PersonStanding,
  Shield,
  Users,
  Umbrella,
  Truck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Edit,
  Trash,
  Save,
  X,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  Filter,
  Settings,
  User,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Calendar,
  Database,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Bookmark,
  Tag,
  Hash,
  Paperclip,
  Link,
  ExternalLink,
  Share,
  Copy,
  Scissors,
  Printer,
  MoreHorizontal,
  MoreVertical,
  type LucideIcon
} from 'lucide-react'

// Mapa de iconos disponibles
const iconMap: Record<string, LucideIcon> = {
  // Seguros específicos
  'car': Car,
  'building': Building,
  'home': Home,
  'heart': Heart,
  'sailboat': Sailboat,
  'stethoscope': Stethoscope,
  'plane': Plane,
  'building2': Building2,
  'person-standing': PersonStanding,
  'shield': Shield,
  'users': Users,
  'umbrella': Umbrella,
  'truck': Truck,
  
  // Contacto y ubicación
  'map-pin': MapPin,
  'phone': Phone,
  'mail': Mail,
  'globe': Globe,
  
  // Estado y valoración
  'star': Star,
  'award': Award,
  'trending-up': TrendingUp,
  'zap': Zap,
  'clock': Clock,
  
  // Feedback
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'alert-circle': AlertCircle,
  'info': Info,
  
  // Acciones
  'plus': Plus,
  'minus': Minus,
  'edit': Edit,
  'trash': Trash,
  'save': Save,
  'x': X,
  
  // Navegación
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'menu': Menu,
  
  // Búsqueda y filtros
  'search': Search,
  'filter': Filter,
  'settings': Settings,
  
  // Usuario y seguridad
  'user': User,
  'lock': Lock,
  'eye': Eye,
  'eye-off': EyeOff,
  
  // Archivos y media
  'download': Download,
  'upload': Upload,
  'calendar': Calendar,
  'database': Database,
  'file-text': FileText,
  'image': Image,
  'video': Video,
  'music': Music,
  'archive': Archive,
  
  // Organización
  'bookmark': Bookmark,
  'tag': Tag,
  'hash': Hash,
  'paperclip': Paperclip,
  
  // Compartir y enlaces
  'link': Link,
  'external-link': ExternalLink,
  'share': Share,
  'copy': Copy,
  'scissors': Scissors,
  'printer': Printer,
  
  // Más opciones
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,
}

export type IconName = keyof typeof iconMap

export function getIcon(iconName: string, className?: string) {
  const IconComponent = iconMap[iconName as IconName]
  
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found. Using default shield icon.`)
    return <Shield className={className} />
  }
  
  return <IconComponent className={className} />
}

export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName as IconName] || Shield
}

export { iconMap }
