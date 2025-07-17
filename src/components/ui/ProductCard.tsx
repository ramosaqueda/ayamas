'use client'

import { ArrowRight, Check } from 'lucide-react'
import { getIcon } from '@/lib/iconUtils'
import { IProduct } from '@/lib/models/Product'

interface ProductCardProps {
    product: IProduct | {
        _id: string
        title: string
        description: string
        price?: string
        period?: string
        features: string[]
        icon: string
        color?: string
        category?: string
        popular?: boolean
        active: boolean
    }
    onClick?: (productId: string) => void
    variant?: 'default' | 'compact' | 'homepage'
    showFeatures?: boolean
    maxFeatures?: number
}

const ProductCard = ({
    product,
    onClick,
    variant = 'default',
    showFeatures = true,
    maxFeatures = 4
}: ProductCardProps) => {
    const handleClick = () => {
        if (onClick) {
            onClick(product._id.toString())
        }
    }

    const isCompact = variant === 'compact'
    const isHomepage = variant === 'homepage'

    return (
        <div
            className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${isCompact ? 'p-6' : 'p-8'
                }`}
            onClick={handleClick}
        >
            {/* Popular Badge */}
            {product.popular && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    ⭐ POPULAR
                </div>
            )}

            {/* Card Content */}
            <div className="relative z-5">
                {/* Icon and Title */}
                <div className={isCompact ? 'flex items-start justify-between mb-4' : 'flex items-start justify-between mb-6'}>
                    <div className={`flex items-center justify-center rounded-xl bg-gradient-to-r ${product.color || 'from-blue-500 to-blue-600'} text-white group-hover:scale-110 transition-transform duration-300 ${isCompact ? 'w-12 h-12' : 'w-16 h-16'
                        }`}>
                        {getIcon(product.icon, isCompact ? "w-6 h-6" : "w-8 h-8")}
                    </div>

                    {(product.price || product.period) && (
                        <div className="text-right">
                            {product.price && (
                                <div className={`font-bold text-blue-600 ${isCompact ? 'text-lg' : 'text-2xl'
                                    }`}>
                                    {product.price}
                                </div>
                            )}
                            {product.period && (
                                <div className="text-sm text-gray-600">
                                    {product.period}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Title and Description */}
                <div className={isCompact ? 'mb-4' : 'mb-6'}>
                    <h3 className={`font-bold text-gray-800 mb-2 ${isCompact ? 'text-lg' : 'text-xl'
                        }`}>
                        {product.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {product.description}
                    </p>
                </div>

                {/* Features */}
                {showFeatures && product.features && product.features.length > 0 && (
                    <div className={isCompact ? 'mb-6' : 'mb-8'}>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Incluye:
                        </h4>
                        <ul className="space-y-2">
                            {product.features.slice(0, maxFeatures).map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600">
                                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        {product.features.length > maxFeatures && (
                            <div className="text-sm text-blue-600 mt-2">
                                +{product.features.length - maxFeatures} tipos más de seguros
                            </div>
                        )}
                    </div>
                )}

                {/* Action Button */}
                <button
                    className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group ${isCompact ? 'py-2 px-4 text-sm' : 'py-3 px-6'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleClick()
                    }}
                >
                    <span>{isHomepage ? 'Ver más' : 'Cotizar'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    )
}

export default ProductCard