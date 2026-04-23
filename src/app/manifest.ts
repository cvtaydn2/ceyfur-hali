import { MetadataRoute } from 'next'
import { getSiteContent } from '@/lib/content-repository'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const content = await getSiteContent()

  return {
    name: content.brand.name,
    short_name: content.brand.name.split(' ')[0],
    description: content.brand.slogan,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/images/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
