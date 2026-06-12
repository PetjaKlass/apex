/** Generiert die CSS-Variablen-Blöcke (Web). Single Source: themes.ts + accents.ts. */
import { accents, type Accent } from './accents';
import { themes, type Theme } from './themes';
import { hexToRgba } from './color-utils';

function themeBlock(name: Theme): string {
  const t = themes[name];
  const lines = [
    `--canvas: ${t.canvas}`,
    `--canvas-blob-2: ${t.canvasBlob2}`,
    `--panel: ${t.panel}`,
    `--panel-strong: ${t.panelStrong}`,
    `--panel-border: ${t.panelBorder}`,
    `--card: ${t.card}`,
    `--card-glass: ${t.cardGlass}`,
    `--subtle: ${t.subtle}`,
    `--hover: ${t.hover}`,
    `--pressed: ${t.pressed}`,
    `--border: ${t.border}`,
    `--border-strong: ${t.borderStrong}`,
    `--fg-1: ${t.fg1}`,
    `--fg-2: ${t.fg2}`,
    `--fg-3: ${t.fg3}`,
    `--fg-disabled: ${t.fgDisabled}`,
    `--fg-inverse: ${t.fgInverse}`,
    `--edge: ${t.edge}`,
    `--shadow-card: ${t.shadowCard}`,
    `--shadow-panel: ${t.shadowPanel}`,
    `--shadow-pop: ${t.shadowPop}`,
    `--hero-bg: ${t.heroBg}`,
    `--hero-text: ${t.heroText}`,
    `--hero-text-2: ${t.heroText2}`,
    `--hero-border: ${t.heroBorder}`,
    ...Object.entries(t.status).map(([k, v]) => `--${k}: ${v}`),
    ...Object.entries(t.statusFg).map(([k, v]) => `--${k}-fg: ${v}`),
  ];
  return `[data-theme='${name}'] {\n  ${lines.join(';\n  ')};\n}`;
}

function accentBlock(name: Accent): string {
  const a = accents[name];
  // Ambient-Blob 1 folgt dem Akzent (Theme-Alpha: light .10 / dark .14 — wir nehmen .12 gemeinsam)
  const lines = [
    `--accent: ${a.base}`,
    `--accent-bright: ${a.bright}`,
    `--accent-dim: ${a.dim}`,
    `--accent-glow: ${a.glow}`,
    `--accent-border: ${a.border}`,
    `--accent-on: ${a.onAccent}`,
    `--accent-text: ${a.text}`,
    `--canvas-blob-1: ${hexToRgba(a.base, 0.12)}`,
  ];
  return `[data-accent='${name}'] {\n  ${lines.join(';\n  ')};\n}`;
}

export function buildCssVariables(): string {
  const themeBlocks = (Object.keys(themes) as Theme[]).map(themeBlock);
  const accentBlocks = (Object.keys(accents) as Accent[]).map(accentBlock);
  return [...themeBlocks, ...accentBlocks].join('\n\n');
}

export const cssVariables = buildCssVariables();

import { accentTextFor } from './accent-text';

/** Theme×Akzent-Compound-Blöcke: AA-feste Akzent-Textfarbe. */
export function buildAccentTextVariables(): string {
  const blocks: string[] = [];
  (Object.keys(themes) as Theme[]).forEach((th) => {
    (Object.keys(accents) as Accent[]).forEach((ac) => {
      blocks.push(
        `[data-theme='${th}'][data-accent='${ac}'] {\n  --accent-text: ${accentTextFor(th, ac)};\n}`
      );
    });
  });
  return blocks.join('\n');
}

export const cssVariablesAll = `${buildCssVariables()}\n\n${buildAccentTextVariables()}`;
