/**
 * Apex Design Tokens — Single Source of Truth.
 * Quelle: docs/design-system.md v4.1 („Floating Glass") §2.
 * Farben leben in themes.ts / accents.ts.
 */
export const tokens = {
  /** 8px-Grid. Hard rule: keine Werte außerhalb dieser Skala. */
  spacing: {
    0: 0,
    px: 1,
    0.5: 2,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
  },
  /** v4-Radius-Skala (eine Stufe größer, Buttons sind Pills). */
  radius: {
    none: 0,
    xs: 6,
    sm: 10,
    DEFAULT: 14,
    lg: 20,
    xl: 26,
    '2xl': 32,
    full: 9999,
  },
  fontFamily: {
    display: ['Cabinet Grotesk', 'Inter', 'system-ui', 'sans-serif'],
    ui: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },
  /** [px, lineHeight] — design-system §4. */
  fontSize: {
    '2xs': [10, 1.4],
    xs: [11, 1.4],
    sm: [13, 1.5],
    base: [15, 1.5],
    lg: [18, 1.4],
    xl: [24, 1.3],
    '2xl': [32, 1.2],
    '3xl': [48, 1.15],
    '4xl': [64, 1.1],
    '5xl': [88, 1.05],
  },
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  letterSpacing: {
    tightest: '-0.04em',
    tight: '-0.02em',
    snug: '-0.01em',
    normal: '0em',
    wide: '0.05em',
    widest: '0.10em',
  },
  zIndex: {
    base: 0,
    content: 1,
    sticky: 100,
    dropdown: 200,
    overlay: 300,
    modal: 400,
    toast: 500,
    tooltip: 600,
    debug: 999,
  },
  /** Millisekunden. */
  duration: { instant: 100, fast: 150, base: 250, slow: 400, slower: 600, long: 1500 },
  easing: {
    spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
    springy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    springOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  layout: {
    sidebarWidth: 'clamp(230px, 17vw, 264px)',
    sidebarCollapsed: 72,
    topbarHeight: 60,
    tabbarHeight: 64,
    contentMaxWidth: 1240,
    contentNarrow: 760,
  },
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
} as const;

export type Tokens = typeof tokens;
