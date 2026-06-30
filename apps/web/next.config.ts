import type { NextConfig } from 'next';

// Vollständig statischer Export — die App rendert client-seitig (Auth + Daten via Supabase im Browser).
const nextConfig = {
  output: 'export',
  eslint: { ignoreDuringBuilds: true },
} as NextConfig;

export default nextConfig;
