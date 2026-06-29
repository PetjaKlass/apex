/**
 * Apex Themes — v4.1 „Floating Glass" (docs/design-system.md §3).
 * Light = Default (Greige-Canvas + weiße Panels) · Dark = Graphit.
 * Karten sind OPAK. Glas (panel/panelStrong) nur auf Panel-Ebene.
 */

export type StatusName = 'success' | 'warning' | 'danger' | 'info' | 'onhold';

export type ThemeColors = {
  canvas: string;
  canvasBlob1: string; // Ambient-Radialfläche (akzentnah) — wird je Akzent überschrieben
  canvasBlob2: string;
  panel: string;
  panelStrong: string;
  panelBorder: string;
  card: string;
  cardGlass: string;
  subtle: string;
  hover: string;
  pressed: string;
  border: string;
  borderStrong: string;
  cardBorder: string; // Karten-Kante: Light transparent, Dark Hairline (löst dark:-Problem)
  fg1: string;
  fg2: string;
  fg3: string;
  fgDisabled: string;
  fgInverse: string;
  edge: string; // 1px-Lichtkante (box-shadow inset)
  shadowCard: string;
  shadowPanel: string;
  shadowPop: string;
  heroBg: string;
  heroText: string;
  heroText2: string;
  heroBorder: string;
  /** Status-Basisfarben (Flächen/Icons) */
  status: Record<StatusName, string>;
  /** AA-feste Textvarianten der Statusfarben für 11-13px-Text auf 12%-Tint (Kontrast-getestet). */
  statusFg: Record<StatusName, string>;
};

export const themes: Record<'light' | 'dark', ThemeColors> = {
  light: {
    canvas: '#ECEAE6',
    canvasBlob2: 'rgba(120, 130, 160, 0.10)',
    canvasBlob1: 'rgba(201, 153, 58, 0.10)',
    panel: 'rgba(255, 255, 255, 0.62)',
    panelStrong: 'rgba(255, 255, 255, 0.78)',
    panelBorder: 'rgba(255, 255, 255, 0.65)',
    card: '#FFFFFF',
    cardGlass: 'rgba(255, 255, 255, 0.55)',
    subtle: '#F2F0EB',
    hover: 'rgba(20, 18, 12, 0.045)',
    pressed: 'rgba(20, 18, 12, 0.08)',
    border: 'rgba(20, 18, 12, 0.07)',
    borderStrong: 'rgba(20, 18, 12, 0.13)',
    cardBorder: 'transparent',
    fg1: '#1B1A17',
    fg2: 'rgba(27, 26, 23, 0.64)',
    fg3: 'rgba(27, 26, 23, 0.44)',
    fgDisabled: 'rgba(27, 26, 23, 0.22)',
    fgInverse: 'rgba(255, 252, 245, 0.95)',
    edge: 'inset 0 1px 0 rgba(255, 255, 255, 0.85)',
    shadowCard: '0 2px 10px rgba(25,22,15,0.05), 0 10px 30px rgba(25,22,15,0.06)',
    shadowPanel: '0 18px 50px rgba(25,22,15,0.10), 0 2px 10px rgba(25,22,15,0.05)',
    shadowPop: '0 28px 80px rgba(25,22,15,0.20), 0 6px 20px rgba(25,22,15,0.10)',
    heroBg: '#16150F',
    heroText: 'rgba(255, 250, 238, 0.95)',
    heroText2: 'rgba(255, 250, 238, 0.55)',
    heroBorder: 'rgba(255, 255, 255, 0.08)',
    status: {
      success: '#34A065',
      warning: '#C98B2E',
      danger: '#C25555',
      info: '#5588B5',
      onhold: '#7B7B88',
    },
    // AA-fest auf 12%-Tint über Weiß (Kontrast-Test erzwingt ≥4.5)
    statusFg: {
      success: '#1F7A47',
      warning: '#8F6010',
      danger: '#A93A3A',
      info: '#33658E',
      onhold: '#5B5B68',
    },
  },
  dark: {
    canvas: '#08080A',
    canvasBlob2: 'rgba(90, 100, 140, 0.12)',
    canvasBlob1: 'rgba(201, 153, 58, 0.14)',
    panel: 'rgba(255, 255, 255, 0.045)',
    panelStrong: 'rgba(24, 24, 28, 0.72)',
    panelBorder: 'rgba(255, 255, 255, 0.09)',
    card: '#141417',
    cardGlass: 'rgba(255, 255, 255, 0.04)',
    subtle: 'rgba(255, 255, 255, 0.055)',
    hover: 'rgba(255, 255, 255, 0.07)',
    pressed: 'rgba(255, 255, 255, 0.11)',
    border: 'rgba(255, 255, 255, 0.075)',
    borderStrong: 'rgba(255, 255, 255, 0.14)',
    cardBorder: 'rgba(255, 255, 255, 0.075)',
    fg1: 'rgba(248, 247, 244, 0.93)',
    fg2: 'rgba(248, 247, 244, 0.62)',
    fg3: 'rgba(248, 247, 244, 0.38)',
    fgDisabled: 'rgba(248, 247, 244, 0.16)',
    fgInverse: 'rgba(14, 13, 10, 0.94)',
    edge: 'inset 0 1px 0 rgba(255, 255, 255, 0.07)',
    shadowCard: '0 1px 2px rgba(0,0,0,0.35), 0 12px 32px rgba(0,0,0,0.30)',
    shadowPanel: '0 24px 70px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.4)',
    shadowPop: '0 36px 100px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)',
    heroBg: 'linear-gradient(135deg, rgba(201,153,58,0.16), #121214 55%)',
    heroText: 'rgba(250, 248, 244, 0.94)',
    heroText2: 'rgba(250, 248, 244, 0.55)',
    heroBorder: 'rgba(201, 153, 58, 0.30)',
    status: {
      success: '#34A065',
      warning: '#C98B2E',
      danger: '#C25555',
      info: '#5588B5',
      onhold: '#7B7B88',
    },
    // Heller für AA auf dunklen Tints (Kontrast-Test erzwingt ≥4.5)
    statusFg: {
      success: '#7BD3A4',
      warning: '#E8BC72',
      danger: '#EC9C9C',
      info: '#9CC3E6',
      onhold: '#B9B9C6',
    },
  },
};

export type Theme = keyof typeof themes;
