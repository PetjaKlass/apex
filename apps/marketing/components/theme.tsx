'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { createContext, useCallback, useContext, useState, useSyncExternalStore } from 'react';
import { accentNames, type Accent } from '@apex/design-tokens';

/** Akzent-Handling analog next-themes: data-accent + localStorage, Pre-Paint via Inline-Script. */
const AccentContext = createContext<{ accent: Accent; setAccent: (a: Accent) => void }>({
  accent: 'gold',
  setAccent: () => undefined,
});

export function useAccent() {
  return useContext(AccentContext);
}

export function AccentProvider({ children }: { children: React.ReactNode }) {
  // Lazy-Init statt Effekt: SSR liefert 'gold', Client liest localStorage einmalig.
  const [accent, setAccentState] = useState<Accent>(() => {
    if (typeof window === 'undefined') return 'gold';
    const stored = window.localStorage.getItem('apex-accent');
    return stored && (accentNames as string[]).includes(stored) ? (stored as Accent) : 'gold';
  });

  const setAccent = useCallback((a: Accent) => {
    setAccentState(a);
    window.localStorage.setItem('apex-accent', a);
    document.documentElement.setAttribute('data-accent', a);
  }, []);

  return <AccentContext.Provider value={{ accent, setAccent }}>{children}</AccentContext.Provider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="light" enableSystem>
      <AccentProvider>{children}</AccentProvider>
    </NextThemesProvider>
  );
}

/** Hydration-Gate ohne setState-im-Effekt (lint-clean): false auf Server, true nach Hydration. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}
