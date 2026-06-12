/**
 * WCAG-AA-Gates für alle realen Text/Hintergrund-Paarungen (design-system v4.1 §3 + §3b).
 * Fällt ein Test, ist der TOKEN falsch — nie der Test. (fg3/eyebrow ist dekorativ → bewusst ungetestet.)
 */
import { describe, expect, it } from 'vitest';
import { accents, accentNames, buildAccent, type Accent } from './accents';
import { accentTextFor } from './accent-text';
import { composite, contrast, ensureContrast, hexToRgba } from './color-utils';
import { themes, type Theme } from './themes';

const themeNames = Object.keys(themes) as Theme[];
const opaque = (c: { r: number; g: number; b: number }) => `rgba(${c.r}, ${c.g}, ${c.b}, 1)`;

/** Liefert den effektiv sichtbaren BG: layer über card über canvas. */
function bgOn(theme: Theme, layer?: string): string {
  const t = themes[theme];
  const card = opaque(composite(t.card, t.canvas));
  if (!layer) return card;
  return opaque(composite(layer, card));
}

describe('Text auf Flächen (AA ≥ 4.5)', () => {
  for (const th of themeNames) {
    const t = themes[th];
    const surfaces: Array<[string, string]> = [
      ['canvas', opaque(composite(t.canvas, '#FFFFFF'))],
      ['card', bgOn(th)],
      ['subtle', bgOn(th, t.subtle)],
      ['hover', bgOn(th, t.hover)],
    ];
    for (const [name, bg] of surfaces) {
      it(`${th}: fg1 auf ${name}`, () => expect(contrast(t.fg1, bg)).toBeGreaterThanOrEqual(4.5));
      it(`${th}: fg2 auf ${name}`, () => expect(contrast(t.fg2, bg)).toBeGreaterThanOrEqual(4.5));
    }
    it(`${th}: heroText auf heroBg`, () => {
      const heroBg = th === 'light' ? t.heroBg : '#121214';
      expect(contrast(t.heroText, heroBg)).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe('Status-Text auf 12%-Tint (AA ≥ 4.5) — Chips sind 11-13px', () => {
  for (const th of themeNames) {
    const t = themes[th];
    for (const k of Object.keys(t.status) as Array<keyof typeof t.status>) {
      it(`${th}: ${k}-fg auf ${k}-Tint`, () => {
        const tint = bgOn(th, hexToRgba(t.status[k], 0.12));
        expect(contrast(t.statusFg[k], tint)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});

describe('Akzente: onAccent auf base+bright (AA ≥ 4.5)', () => {
  for (const ac of accentNames) {
    const a = accents[ac];
    it(`${ac}: onAccent auf base`, () =>
      expect(contrast(a.onAccent, a.base)).toBeGreaterThanOrEqual(4.5));
    it(`${ac}: onAccent auf bright`, () =>
      expect(contrast(a.onAccent, a.bright)).toBeGreaterThanOrEqual(4.5));
  }
});

describe('Akzent-Text auf accent-dim (AA ≥ 4.5) — beide Themes × 5 Akzente', () => {
  for (const th of themeNames) {
    for (const ac of accentNames) {
      it(`${th}/${ac}`, () => {
        const t = themes[th];
        const a = accents[ac as Accent];
        const tint = bgOn(th, hexToRgba(a.base, 0.13));
        expect(contrast(accentTextFor(th, ac), tint)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});

describe('Custom-Akzent-Builder', () => {
  it('liefert für extreme Farben AA-festes onAccent', () => {
    for (const hex of ['#111111', '#FFEE88', '#2D5BFF', '#0B3D2E']) {
      const a = buildAccent(hex);
      expect(contrast(a.onAccent, a.base)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('ensureContrast konvergiert immer', () => {
    expect(contrast(ensureContrast('#C9993A', '#FFFFFF'), '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    expect(contrast(ensureContrast('#C9993A', '#08080A'), '#08080A')).toBeGreaterThanOrEqual(4.5);
  });
});
