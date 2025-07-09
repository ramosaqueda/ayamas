/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ffebee',
          100: '#ffcdd2',
          200: '#ef9a9a',
          300: '#e57373',
          400: '#ef5350',
          500: '#DC143C', // Main red
          600: '#B22222', // Secondary red
          700: '#8B0000', // Dark red
          800: '#c62828',
          900: '#b71c1c',
        },
        secondary: {
          50: '#fffbf0',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFD700', // Gold accent
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        neutral: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#000000',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
        serif: ['ui-serif', 'Georgia'],
        mono: ['ui-monospace', 'SFMono-Regular'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-light': 'bounceLight 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceLight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'ayamas': '0 2px 20px rgba(220, 20, 60, 0.1)',
        'ayamas-lg': '0 10px 30px rgba(220, 20, 60, 0.15)',
        'ayamas-xl': '0 20px 40px rgba(220, 20, 60, 0.2)',
      },
    },
  },
  plugins: [],
}
