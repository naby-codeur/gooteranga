import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Corriger les problèmes de source maps
  productionBrowserSourceMaps: false,
  // Désactiver complètement les source maps pour éviter les erreurs de parsing
  webpack: (config, { dev, isServer }) => {
    // Désactiver les source maps en développement et production
    config.devtool = false;
    
    // Ignorer les warnings de source maps
    if (config.ignoreWarnings) {
      config.ignoreWarnings.push(/Failed to parse source map/);
    } else {
      config.ignoreWarnings = [/Failed to parse source map/];
    }
    
    return config;
  },
};

export default withNextIntl(nextConfig);
