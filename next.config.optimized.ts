import type { NextConfig } from 'next';

/**
 * Configuração otimizada do Next.js para performance
 * Inclui otimizações de bundle, imagens, e outras melhorias
 */
const nextConfig: NextConfig = {
  // Otimizações de performance
  experimental: {
    // Otimizar CSS
    optimizeCss: true,
    // Otimizar imports
    optimizePackageImports: ['@/components', '@/hooks', '@/services'],
    // Compressão gzip
    gzipSize: true,
  },

  // Compressão
  compress: true,

  // Otimizações de imagens
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Otimizações de bundle
  webpack: (config, { dev, isServer }) => {
    // Otimizações para produção
    if (!dev && !isServer) {
      // Minificar CSS
      config.optimization.minimize = true;
      
      // Otimizar chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    return config;
  },

  // Headers de performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Otimizações de build
  swcMinify: true,
  
  // Otimizações de runtime
  poweredByHeader: false,
  
  // Otimizações de cache
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
