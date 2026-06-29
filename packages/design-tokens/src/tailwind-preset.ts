/**
 * Tailwind-Preset (v3.4) für BEIDE Apps (Web via CSS-Vars, Native via NativeWind vars()).
 * Semantische Klassen: bg-canvas, bg-card, text-fg-1, border-strong, bg-accent, text-accent-on …
 * Werte zeigen auf CSS-Variablen — Theme-/Akzentwechsel zur Laufzeit ohne Rebuild.
 */
import { tokens } from './tokens';

const px = (n: number) => `${n}px`;

const spacing = Object.fromEntries(
  Object.entries(tokens.spacing).map(([k, v]) => [k, px(v as number)])
);

const borderRadius = Object.fromEntries(
  Object.entries(tokens.radius).map(([k, v]) => [k, v === 9999 ? '9999px' : px(v as number)])
);

const fontSize = Object.fromEntries(
  Object.entries(tokens.fontSize).map(([k, [size, lh]]) => [k, [px(size as number), `${lh}`]])
);

export const apexPreset = {
  theme: {
    spacing,
    borderRadius,
    fontSize,
    fontFamily: tokens.fontFamily as unknown as Record<string, string[]>,
    fontWeight: Object.fromEntries(Object.entries(tokens.fontWeight).map(([k, v]) => [k, `${v}`])),
    letterSpacing: { ...tokens.letterSpacing },
    zIndex: Object.fromEntries(Object.entries(tokens.zIndex).map(([k, v]) => [k, `${v}`])),
    transitionDuration: Object.fromEntries(
      Object.entries(tokens.duration).map(([k, v]) => [k, `${v}ms`])
    ),
    transitionTimingFunction: { ...tokens.easing },
    screens: Object.fromEntries(
      Object.entries(tokens.breakpoints).map(([k, v]) => [k, px(v as number)])
    ),
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      canvas: 'var(--canvas)',
      panel: {
        DEFAULT: 'var(--panel)',
        strong: 'var(--panel-strong)',
        border: 'var(--panel-border)',
      },
      card: { DEFAULT: 'var(--card)', glass: 'var(--card-glass)' },
      subtle: 'var(--subtle)',
      hover: 'var(--hover)',
      pressed: 'var(--pressed)',
      border: { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
      hairline: 'var(--card-border)',
      fg: {
        1: 'var(--fg-1)',
        2: 'var(--fg-2)',
        3: 'var(--fg-3)',
        disabled: 'var(--fg-disabled)',
        inverse: 'var(--fg-inverse)',
      },
      accent: {
        DEFAULT: 'var(--accent)',
        bright: 'var(--accent-bright)',
        dim: 'var(--accent-dim)',
        glow: 'var(--accent-glow)',
        border: 'var(--accent-border)',
        on: 'var(--accent-on)',
        text: 'var(--accent-text)',
      },
      hero: {
        DEFAULT: 'var(--hero-bg)',
        text: 'var(--hero-text)',
        text2: 'var(--hero-text-2)',
        border: 'var(--hero-border)',
      },
      success: { DEFAULT: 'var(--success)', fg: 'var(--success-fg)' },
      warning: { DEFAULT: 'var(--warning)', fg: 'var(--warning-fg)' },
      danger: { DEFAULT: 'var(--danger)', fg: 'var(--danger-fg)' },
      info: { DEFAULT: 'var(--info)', fg: 'var(--info-fg)' },
      onhold: { DEFAULT: 'var(--onhold)', fg: 'var(--onhold-fg)' },
    },
    boxShadow: {
      none: 'none',
      card: 'var(--shadow-card)',
      panel: 'var(--shadow-panel)',
      pop: 'var(--shadow-pop)',
      edge: 'var(--edge)',
      'card-edge': 'var(--shadow-card), var(--edge)',
      'panel-edge': 'var(--shadow-panel), var(--edge)',
      'pop-edge': 'var(--shadow-pop), var(--edge)',
    },
    extend: {},
  },
};

export default apexPreset;
