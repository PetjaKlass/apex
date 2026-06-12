import type { Config } from 'tailwindcss';

// Tailwind v3.4 (ADR 0012). Ab Phase 02 kommt das Preset aus packages/design-tokens.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
export default config;
