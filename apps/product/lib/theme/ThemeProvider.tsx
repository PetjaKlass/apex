import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { vars } from 'nativewind';
import {
  accentNames,
  accents,
  themes,
  themeVars,
  type Accent,
  type Theme,
  type ThemeColors,
} from '@apex/design-tokens';
import { settingsStorage } from './storage';

export type ThemeSetting = Theme | 'system';

type ThemeContextValue = {
  /** Aufgelöstes Theme (system → light/dark). */
  theme: Theme;
  setting: ThemeSetting;
  setTheme: (t: ThemeSetting) => void;
  accent: Accent;
  setAccent: (a: Accent) => void;
  /** Aktuelle Farbwerte für imperatives Styling (Charts, Navigation-Optionen …). */
  colors: ThemeColors & { accent: (typeof accents)[Accent] };
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = 'apex-theme';
const ACCENT_KEY = 'apex-accent';

function readInitialTheme(): ThemeSetting {
  const v = settingsStorage.get(THEME_KEY);
  return v === 'dark' || v === 'light' || v === 'system' ? v : 'light'; // v4.1: Light ist Default
}

function readInitialAccent(): Accent {
  const v = settingsStorage.get(ACCENT_KEY);
  return v && (accentNames as string[]).includes(v) ? (v as Accent) : 'gold';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [setting, setSetting] = useState<ThemeSetting>(readInitialTheme);
  const [accent, setAccentState] = useState<Accent>(readInitialAccent);

  const theme: Theme = setting === 'system' ? (system === 'dark' ? 'dark' : 'light') : setting;

  const setTheme = useCallback((t: ThemeSetting) => {
    setSetting(t);
    settingsStorage.set(THEME_KEY, t);
  }, []);

  const setAccent = useCallback((a: Accent) => {
    setAccentState(a);
    settingsStorage.set(ACCENT_KEY, a);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setting,
      setTheme,
      accent,
      setAccent,
      colors: { ...themes[theme], accent: accents[accent] },
    }),
    [theme, setting, setTheme, accent, setAccent]
  );

  // vars() setzt die CSS-Variablen für NativeWind — identische Namen wie im Web.
  const style = useMemo(() => vars(themeVars(theme, accent)), [theme, accent]);

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, style]} className="bg-canvas">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme muss innerhalb von <ThemeProvider> verwendet werden.');
  return ctx;
}
