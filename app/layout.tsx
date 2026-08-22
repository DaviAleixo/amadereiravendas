import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Alfa_Slab_One, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const display = Alfa_Slab_One({ variable: '--font-display', subsets: ['latin'], weight: ['400'] })
const body = Be_Vietnam_Pro({ variable: '--font-body', subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://amadeireira.com.br'),
  title: 'Amadeireira — Madeira que transforma ambientes',
  description: 'Móveis marcantes, acabamento cuidadoso e a beleza natural da madeira em cada detalhe.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Amadeireira — Madeira que transforma ambientes', description: 'Conheça nossas peças em madeira maciça.', url: 'https://amadeireira.com.br', siteName: 'Amadeireira', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Amadeireira — Madeira que transforma ambientes', description: 'Conheça nossas peças em madeira maciça.' },
  icons: { icon: '/icon.svg' },
}

export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#0d0b09', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={`${display.variable} ${body.variable}`} suppressHydrationWarning><body className="antialiased" suppressHydrationWarning>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
