/** CSS-Var-Maps für NativeWind vars() — gleiche Namen wie css-variables.ts (Web). */
import { accents, type Accent } from './accents';
import { themes, type Theme } from './themes';
import { hexToRgba } from './color-utils';
import { accentTextFor } from './accent-text';

export function themeVars(theme: Theme, accent: Accent): Record<string, string> {
  const t = themes[theme];
  const a = accents[accent];
  return {
    '--canvas': t.canvas,
    '--canvas-blob-2': t.canvasBlob2,
    '--panel': t.panel,
    '--panel-strong': t.panelStrong,
    '--panel-border': t.panelBorder,
    '--card': t.card,
    '--card-glass': t.cardGlass,
    '--subtle': t.subtle,
    '--hover': t.hover,
    '--pressed': t.pressed,
    '--border': t.border,
    '--border-strong': t.borderStrong,
    '--fg-1': t.fg1,
    '--fg-2': t.fg2,
    '--fg-3': t.fg3,
    '--fg-disabled': t.fgDisabled,
    '--fg-inverse': t.fgInverse,
    '--edge': t.edge,
    '--shadow-card': t.shadowCard,
    '--shadow-panel': t.shadowPanel,
    '--shadow-pop': t.shadowPop,
    '--hero-bg': theme === 'light' ? t.heroBg : '#121214', // native: kein Gradient-String in bg-color
    '--hero-text': t.heroText,
    '--hero-text-2': t.heroText2,
    '--hero-border': t.heroBorder,
    '--success': t.status.success,
    '--success-fg': t.statusFg.success,
    '--warning': t.status.warning,
    '--warning-fg': t.statusFg.warning,
    '--danger': t.status.danger,
    '--danger-fg': t.statusFg.danger,
    '--info': t.status.info,
    '--info-fg': t.statusFg.info,
    '--onhold': t.status.onhold,
    '--onhold-fg': t.statusFg.onhold,
    '--accent': a.base,
    '--accent-bright': a.bright,
    '--accent-dim': a.dim,
    '--accent-glow': a.glow,
    '--accent-border': a.border,
    '--accent-on': a.onAccent,
    '--accent-text': accentTextFor(theme, accent),
    '--canvas-blob-1': hexToRgba(a.base, 0.12),
  };
}
