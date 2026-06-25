import { MetadataRoute } from 'next';

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OKISO | Virtual Artist',
    short_name: 'OKISO',
    description: 'OKISO, at your command! VTuber and VOCALOID producer making hyperpop and electronic music.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png?v=20260626',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png?v=20260626',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
