import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Aumentar el límite de tamaño para el caché de Next.js
  // experimental: {
  //   largePageDataBytes: 512 * 1024,
  // },
  
  // Configuración específica para mejorar compatibilidad con Safari/iOS
  async headers() {
    return [
      {
        // Aplicar headers a todas las rutas
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            // En producción, usa tu dominio exacto, no wildcards
            value: process.env.NODE_ENV === 'production' ? 'https://mathtexpedia.es' : '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cache-Control, Pragma',
          },
          {
            key: 'Vary',
            value: 'Origin, Cookie, Accept-Encoding',
          },
          // Header para indicar que el sitio permite cookies de terceros
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()',
          },
        ],
      },
      {
        // Headers específicos para rutas de API
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },

  // Deshabilitar X-Powered-By para seguridad
  poweredByHeader: false,

  // Configuración para componentes externos
  serverExternalPackages: [],

  // Configuración de imágenes si usas next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;