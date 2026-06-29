/**
 * Guard: Jede vom Tailwind-Preset referenzierte CSS-Variable MUSS von beiden
 * Generatoren emittiert werden — Web (cssVariablesAll) und Native (themeVars).
 * Fängt Klassen wie `border-hairline → var(--card-border)` ohne Emission ab
 * (Regression 2026-06-29: --card-border war nirgendwo gesetzt → unsichtbarer
 * schwarzer Rand). Build/typecheck sehen das nicht, weil es ein Laufzeit-Var-Loch ist.
 */
import { describe, it, expect } from 'vitest';
import { apexPreset } from './tailwind-preset';
import { cssVariablesAll } from './css-variables';
import { themeVars } from './native-vars';
import { accentNames } from './accents';
import { themes } from './themes';

function collectVarRefs(node: unknown, acc: Set<string>): void {
  if (typeof node === 'string') {
    for (const m of node.matchAll(/var\((--[a-z0-9-]+)\)/g)) {
      if (m[1]) acc.add(m[1]);
    }
  } else if (Array.isArray(node)) {
    node.forEach((n) => collectVarRefs(n, acc));
  } else if (node && typeof node === 'object') {
    Object.values(node).forEach((n) => collectVarRefs(n, acc));
  }
}

const referenced = new Set<string>();
collectVarRefs(apexPreset, referenced);

// Web: alle Vars, die im generierten CSS-String als `--x:` vorkommen
const webEmitted = new Set<string>(
  [...cssVariablesAll.matchAll(/(--[a-z0-9-]+)\s*:/g)]
    .map((m) => m[1])
    .filter((x): x is string => Boolean(x))
);

// Native: Union über alle Theme/Accent-Kombinationen
const nativeEmitted = new Set<string>();
for (const th of Object.keys(themes) as (keyof typeof themes)[]) {
  for (const ac of accentNames) {
    Object.keys(themeVars(th, ac)).forEach((k) => nativeEmitted.add(k));
  }
}

describe('preset CSS variables sind vollständig verdrahtet', () => {
  it('referenziert mindestens die Kern-Tokens', () => {
    expect(referenced.has('--card-border')).toBe(true);
    expect(referenced.size).toBeGreaterThan(30);
  });

  it('jede referenzierte var(--x) wird im Web-CSS emittiert', () => {
    const missing = [...referenced].filter((v) => !webEmitted.has(v));
    // missing-Liste erscheint im toEqual-Diff, falls eine Var fehlt
    expect(missing).toEqual([]);
  });

  it('jede referenzierte var(--x) wird in themeVars (native) emittiert', () => {
    const missing = [...referenced].filter((v) => !nativeEmitted.has(v));
    expect(missing).toEqual([]);
  });
});
