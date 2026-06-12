/**
 * UiColors-Bridge: RN-Props (placeholderTextColor, Icon-color, ActivityIndicator …)
 * können keine CSS-Variablen lesen. Die App speist hier die AKTUELLEN Token-Werte ein;
 * Default = light/gold (SSR/Fallback). Behebt die Phase-04-Hardcodes (log Phase 04).
 */
import { createContext, useContext } from 'react';
import { accents, composite, themes, type Accent, type Theme } from '@apex/design-tokens';

export type UiColors = {
  theme: Theme;
  fg1: string;
  fg2: string;
  fg3: string;
  fgInverse: string;
  card: string;
  subtle: string;
  pressed: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentBright: string;
  accentOn: string;
  accentDim: string;
  danger: string;
  dangerFg: string;
  success: string;
  onhold: string;
};

export function buildUiColors(theme: Theme, accent: Accent): UiColors {
  const t = themes[theme];
  const a = accents[accent];
  return {
    theme,
    fg1: t.fg1,
    fg2: t.fg2,
    fg3: t.fg3,
    fgInverse: t.fgInverse,
    card: t.card,
    subtle: t.subtle,
    pressed: t.pressed,
    border: t.border,
    borderStrong: t.borderStrong,
    accent: a.base,
    accentBright: a.bright,
    accentOn: a.onAccent,
    accentDim: a.dim,
    danger: t.status.danger,
    dangerFg: t.statusFg.danger,
    success: t.status.success,
    onhold: t.status.onhold,
  };
}

const UiColorsContext = createContext<UiColors>(buildUiColors('light', 'gold'));
export const UiColorsProvider = UiColorsContext.Provider;

export function useUiColors(): UiColors {
  return useContext(UiColorsContext);
}

/** Deterministische Pastell-Palette für Fremd-Avatare (avatar.md). Light-Basis; Dark via 85%-Mix auf #141417. */
const PASTELS_LIGHT: Array<{ bg: string; fg: string }> = [
  { bg: '#E8DFD0', fg: '#6B5A3E' },
  { bg: '#DCE6DC', fg: '#3F5C46' },
  { bg: '#D9E2EC', fg: '#3D5A75' },
  { bg: '#EADDE2', fg: '#7A4A5C' },
  { bg: '#E4E0EE', fg: '#564B7A' },
  { bg: '#E9E4D4', fg: '#6A5F35' },
  { bg: '#D8E6E6', fg: '#3C6363' },
  { bg: '#ECDFD6', fg: '#7A523D' },
];

export function avatarPalette(name: string, theme: Theme): { bg: string; fg: string } {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const idx = hash % PASTELS_LIGHT.length;
  const base = PASTELS_LIGHT[idx] ?? PASTELS_LIGHT[0]!;
  if (theme === 'light') return base;
  const mixed = composite(`${base.bg}D9`, '#141417'); // ≈85% über Dark-Card
  return { bg: `rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`, fg: base.bg };
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1] ?? '') : '';
  const init = last ? `${first[0] ?? ''}${last[0] ?? ''}` : first.slice(0, 2);
  return init.toUpperCase();
}
