import type { NextConfig } from 'next';

// eslint-Schlüssel via Cast (Typ in dieser next-Version unvollständig; Runtime liest ihn)
const nextConfig = { eslint: { ignoreDuringBuilds: true } } as NextConfig;

export default nextConfig;
