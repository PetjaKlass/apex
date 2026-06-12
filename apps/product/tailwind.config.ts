import type { Config } from 'tailwindcss';
import { apexPreset } from '@apex/design-tokens';

// Tailwind v3.4 + NativeWind v4 (ADR 0012). Werte ausschließlich aus dem Apex-Preset.
const config: Config = {
  presets: [require('nativewind/preset'), apexPreset as unknown as Config],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  plugins: [],
};
export default config;
