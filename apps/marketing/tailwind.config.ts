import type { Config } from 'tailwindcss';
import { apexPreset } from '@apex/design-tokens';

// Tailwind v3.4 (ADR 0012) — alle Werte kommen aus dem Apex-Preset (Single Source of Truth).
const config: Config = {
  presets: [apexPreset as unknown as Config],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  plugins: [],
};
export default config;
