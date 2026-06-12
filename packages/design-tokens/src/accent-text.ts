/** Theme-abhängige Akzent-TEXT-Farbe (für Chips: Text auf accent-dim). AA-garantiert. */
import { accents, type Accent } from './accents';
import { themes, type Theme } from './themes';
import { composite, ensureContrast, hexToRgba } from './color-utils';

export function accentTextFor(theme: Theme, accent: Accent): string {
  const a = accents[accent];
  const t = themes[theme];
  // Hintergrund des Chips: dim (13% Akzent) über card über canvas
  const cardOpaque = composite(t.card, t.canvas);
  const cardCss = `rgba(${cardOpaque.r}, ${cardOpaque.g}, ${cardOpaque.b}, 1)`;
  const dimOver = composite(hexToRgba(a.base, 0.13), cardCss);
  const bg = `rgba(${dimOver.r}, ${dimOver.g}, ${dimOver.b}, 1)`;
  return ensureContrast(a.base, bg, 4.5);
}
