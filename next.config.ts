import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

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