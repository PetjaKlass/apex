/**
 * Apex Akzent-System — 5 Presets + Custom-Builder (design-system §3).
 * Alle abgeleiteten Werte VORBERECHNET (native kann kein color-mix).
 * AA-GARANTIE: buildAccent justiert base/bright in minimalen L-Schritten nach,
 * bis `onAccent` auf BEIDEN Flächen ≥ 4.5 erreicht ("Token justieren, nicht die Regel" — §3b).
 */
import { contrast, hexToRgba, hexToRgb, lighten, rgbToHsl } from './color-utils';

export type AccentValues = {
  base: string;
  bright: string;
  dim: string; // Fills/Badges (~13% Alpha)
  glow: string; // Aura (~8% Alpha)
  border: string; // Outlines (~30% Alpha)
  onAccent: string; // Text auf base/bright-Fläche (AA-garantiert)
  text: string; // Akzent als Textfarbe (theme-spezifisch via accentTextFor überschrieben)
};

const ON_DARK = 'rgba(14, 13, 10, 0.94)';
const ON_LIGHT = 'rgba(255, 252, 245, 0.98)';

export function buildAccent(baseInput: string, brightInput?: string): AccentValues {
  let base = baseInput;
  let bright = brightInput ?? lighten(baseInput, 0.08);

  const score = (on: string) => Math.min(contrast(on, base), contrast(on, bright));
  const best = () => (score(ON_DARK) >= score(ON_LIGHT) ? ON_DARK : ON_LIGHT);

  let on = best();
  for (let i = 0; i < 30 && score(on) < 4.5; i++) {
    const dir = on === ON_LIGHT ? -0.015 : 0.015; // heller Text → Flächen dunkler, sonst heller
    if (contrast(on, base) < 4.5) base = lighten(base, dir);
    if (contrast(on, bright) < 4.5) bright = lighten(bright, dir);
    on = best();
  }

  const { r, g, b } = hexToRgb(base);
  const { l } = rgbToHsl(r, g, b);
  return {
    base,
    bright,
    dim: hexToRgba(base, 0.13),
    glow: hexToRgba(base, 0.08),
    border: hexToRgba(base, 0.3),
    onAccent: on,
    text: l < 0.35 ? lighten(base, 0.12) : base,
  };
}

export const accents = {
  gold: buildAccent('#C9993A', '#E2B153'),
  silver: buildAccent('#8B9AAB', '#A8B8C8'),
  rose: buildAccent('#C4707A', '#E08890'),
  sapphire: buildAccent('#4A7FA5', '#6099C0'),
  emerald: buildAccent('#3A7D58', '#50A070'),
} as const satisfies Record<string, AccentValues>;

export type Accent = keyof typeof accents;
export const accentNames = Object.keys(accents) as Accent[];

/** Validiert Custom-Hex: parsebar + nicht zu nah an den Theme-Grundflächen. */
export function isValidCustomAccent(hex: string): boolean {
  if (!/^#([0-9a-fA-F]{6})$/.test(hex)) return false;
  return contrast(hex, '#FFFFFF') >= 1.6 && contrast(hex, '#08080A') >= 1.6;
}
