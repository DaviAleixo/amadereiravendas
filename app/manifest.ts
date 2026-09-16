import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Amadeireira — Painel Admin',
    short_name: 'Admin Amadeireira',
    description: 'Painel Administrativo da Amadeireira para gestão de catálogo, produtos e configurações.',
    start_url: '/admin',
    scope: '/',
    display: 'standalone',
    background_color: '#0e0805',
    theme_color: '#0e0805',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo1.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'any maskable'
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };
}
