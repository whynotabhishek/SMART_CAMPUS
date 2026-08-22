import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CampusFind',
    short_name: 'CampusFind',
    description: 'AI-powered campus Lost & Found system',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF5',
    theme_color: '#D4A574',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
