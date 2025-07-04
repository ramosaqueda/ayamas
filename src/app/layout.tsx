import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import '../styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Ayamas Seguros - Tu Protección, Nuestro Compromiso',
  description: 'Más de 25 años protegiendo lo que más valoras. Seguros confiables, atención personalizada y respaldo garantizado.',
  keywords: 'seguros, seguros chile, seguro auto, seguro hogar, seguro vida, seguro salud, seguros ayamas',
  authors: [{ name: 'Ayamas Seguros' }],
  creator: 'Ayamas Seguros',
  publisher: 'Ayamas Seguros',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://segurosayamas.cl'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ayamas Seguros - Tu Protección, Nuestro Compromiso',
    description: 'Más de 25 años protegiendo lo que más valoras. Seguros confiables, atención personalizada y respaldo garantizado.',
    url: 'https://segurosayamas.cl',
    siteName: 'Ayamas Seguros',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ayamas Seguros',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayamas Seguros - Tu Protección, Nuestro Compromiso',
    description: 'Más de 25 años protegiendo lo que más valoras. Seguros confiables, atención personalizada y respaldo garantizado.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${poppins.variable} font-sans`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
