import { getLocales } from 'expo-localization';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { defaultLocale, isLocale, translate, type Locale } from '@apex/i18n';
import { settingsStorage } from '@/lib/theme/storage';

type Values = Record<string, string | number>;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** Übersetzt einen Key, z.B. t('tasks.count', { count: 3 }). */
  t: (key: string, values?: Values) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const LOCALE_KEY = 'apex-locale';

function readInitialLocale(): Locale {
  const stored = settingsStorage.get(LOCALE_KEY);
  if (isLocale(stored)) return stored;
  const device = getLocales()[0]?.languageCode; // Gerätesprache als Erstwert
  return isLocale(device) ? device : defaultLocale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    settingsStorage.set(LOCALE_KEY, l);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, values) => translate(locale, key, values),
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale muss innerhalb von <LocaleProvider> verwendet werden.');
  return ctx;
}

/** Kurzform: const t = useT(); t('common.save') */
export function useT() {
  return useLocale().t;
}
