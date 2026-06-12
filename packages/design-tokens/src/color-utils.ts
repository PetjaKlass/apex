/** Farb-Utilities: hex↔rgb(a), Luminanz, WCAG-Kontrast, HSL-Ableitungen für Custom-Akzente. */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const f =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = parseInt(f, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Parsen von #hex ODER rgba()-Strings zu {r,g,b,a}. */
export function parseColor(c: string): { r: number; g: number; b: number; a: number } {
  if (c.startsWith('#')) return { ...hexToRgb(c), a: 1 };
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m || m[1] === undefined) throw new Error(`Unparsbare Farbe: ${c}`);
  const parts = m[1].split(',').map((p) => parseFloat(p.trim()));
  return { r: parts[0] ?? 0, g: parts[1] ?? 0, b: parts[2] ?? 0, a: parts[3] ?? 1 };
}

/** Alpha-Compositing: fg über bg (beide beliebige CSS-Farben), Ergebnis opak. */
export function composite(fg: string, bg: string): { r: number; g: number; b: number } {
  const f = parseColor(fg);
  const b = parseColor(bg);
  const a = f.a;
  return {
    r: Math.round(f.r * a + b.r * (1 - a)),
    g: Math.round(f.g * a + b.g * (1 - a)),
    b: Math.round(f.b * a + b.b * (1 - a)),
  };
}

function channelLum(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function luminance(rgb: { r: number; g: number; b: number }): number {
  return 0.2126 * channelLum(rgb.r) + 0.7152 * channelLum(rgb.g) + 0.0722 * channelLum(rgb.b);
}

/** WCAG-Kontrast zweier Farben; fg darf Alpha haben und wird über bg komponiert. */
export function contrast(fg: string, bg: string): number {
  const bgRgb = composite(bg, '#FFFFFF'); // bg ggf. selbst transparent → über Weiß stabilisieren
  const fgRgb = composite(fg, `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 1)`);
  const l1 = luminance(fgRgb);
  const l2 = luminance(bgRgb);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h, s, l };
}

export function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const to = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

export function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return hslToHex(h, s, Math.min(1, l + amount));
}

/**
 * Hellt/dunkelt `hex` schrittweise, bis es auf `bg` mindestens `target` Kontrast erreicht.
 * Richtung automatisch: gegen helle BGs wird gedunkelt, gegen dunkle aufgehellt.
 */
export function ensureContrast(hex: string, bg: string, target = 4.5): string {
  if (contrast(hex, bg) >= target) return hex;
  const bgLum = luminance(composite(bg, '#FFFFFF'));
  const dir = bgLum > 0.4 ? -1 : 1; // heller BG → dunkler machen
  let { h, s, l } = (({ r, g, b }) => rgbToHsl(r, g, b))(hexToRgb(hex));
  for (let i = 0; i < 40; i++) {
    l = Math.min(0.98, Math.max(0.02, l + dir * 0.02));
    const candidate = hslToHex(h, s, l);
    if (contrast(candidate, bg) >= target) return candidate;
  }
  return dir === -1 ? '#1B1A17' : '#F8F7F4';
}
