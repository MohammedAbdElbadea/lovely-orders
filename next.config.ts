import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling Supabase through Webpack's server
  // chunking system. Instead Node.js requires them directly at runtime.
  // NOTE: framer-motion must NOT be here – it's a client-side library
  // that uses React Hooks and must stay inside the webpack bundle.
  serverExternalPackages: [
    "@supabase/supabase-js",
    "@supabase/ssr",
  ],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack(config: any, { isServer }: { isServer: boolean }) {
    if (isServer) {
      // Disable vendor-chunk splitting entirely for the server bundle.
      // This is what generates the fragile vendor-chunks/*.js files that
      // become stale / missing when .next is partially overwritten on Windows.
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
