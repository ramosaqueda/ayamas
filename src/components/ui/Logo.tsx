'use client'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizes = {
    sm: {
      container: 'h-8',
      mainText: 'text-lg',
      ltdaText: 'text-lg',
      subText: 'text-xs px-2 py-0.5'
    },
    md: {
      container: 'h-12',
      mainText: 'text-2xl',
      ltdaText: 'text-2xl',
      subText: 'text-sm px-3 py-1'
    },
    lg: {
      container: 'h-16',
      mainText: 'text-3xl',
      ltdaText: 'text-3xl',
      subText: 'text-base px-4 py-1'
    }
  }

  const currentSize = sizes[size]

  return (
    <div className={`inline-flex flex-col ${className}`}>
      {/* Main Logo Row */}
      <div className={`flex items-center ${currentSize.container}`}>
        {/* Red Section - A&A+ */}
        <div className="bg-red-800 text-white px-3 py-2 flex items-center justify-center h-full">
          <span className={`font-bold ${currentSize.mainText} leading-none`}>
            A&A<span className="text-yellow-300">+</span>
          </span>
        </div>

        {/* White Section - Ltda. */}
        <div className="bg-white text-neutral-800 px-3 py-2 flex items-center justify-center h-full border-r border-neutral-200">
          <span className={`font-bold ${currentSize.ltdaText} leading-none`}>
            Ltda.
          </span>
        </div>
      </div>

      {/* Gray Subtitle */}
      <div className="bg-neutral-600 text-white w-full">
        <div className={`text-center ${currentSize.subText} font-medium tracking-wide uppercase`}>
          Corredores de Seguros
        </div>
      </div>
    </div>
  )
}

export default Logo
