'use client';

import { useTheme } from 'next-themes';
import { accentNames } from '@apex/design-tokens';
import { useAccent, useHydrated } from '@/components/theme';

const SWATCHES = [
  ['canvas', 'bg-canvas border border-strong'],
  ['card', 'bg-card'],
  ['subtle', 'bg-subtle'],
  ['accent', 'bg-accent'],
  ['accent-dim', 'bg-accent-dim'],
  ['success', 'bg-success'],
  ['warning', 'bg-warning'],
  ['danger', 'bg-danger'],
  ['info', 'bg-info'],
] as const;

export default function TokensTestPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const { accent, setAccent } = useAccent();
  const hydrated = useHydrated();
  if (!hydrated) return null;

  return (
    <main className="mx-auto min-h-screen max-w-2xl p-8">
      <p className="text-2xs text-fg-3 font-semibold uppercase tracking-widest">Dev — Tokens</p>
      <h1 className="font-display mt-2 text-2xl font-bold tracking-tight">
        Theme: {resolvedTheme} · Akzent: {accent}
      </h1>

      <div className="mt-6 flex gap-3">
        <button
          className="bg-accent text-accent-on shadow-card-edge h-9 rounded-full px-5 text-sm font-semibold"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          Theme wechseln
        </button>
        {accentNames.map((a) => (
          <button
            key={a}
            onClick={() => setAccent(a)}
            aria-pressed={accent === a}
            className={`border-strong h-9 rounded-full border px-4 text-sm ${a === accent ? 'bg-accent-dim text-accent-text' : 'bg-card text-fg-2'}`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="bg-card shadow-card-edge mt-8 rounded-lg p-6">
        <h2 className="text-fg-1 text-sm font-semibold">Flächen & Status</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {SWATCHES.map(([name, cls]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className={`h-12 w-full rounded ${cls}`} />
              <span className="text-2xs text-fg-3 font-mono">{name}</span>
            </div>
          ))}
        </div>
        <p className="text-fg-1 mt-6 text-base">Fließtext fg-1 — ruhig und präzise.</p>
        <p className="text-fg-2 text-sm">Sekundär fg-2 — AA-fest seit v4.1.</p>
        <p className="mt-2 text-sm">
          <span className="bg-accent-dim text-accent-text rounded-full px-3 py-1 text-xs font-medium">
            Akzent-Chip
          </span>{' '}
          <span
            className="text-success-fg rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: 'color-mix(in srgb, var(--success) 12%, transparent)' }}
          >
            Im Plan
          </span>
        </p>
      </div>
    </main>
  );
}
