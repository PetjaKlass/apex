import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LocaleProvider } from '@/lib/i18n';
import { UiColorsProvider, buildUiColors } from '@apex/ui';
import { ThemeProvider, useTheme } from '@/lib/theme';
import '../global.css';

function AppStack() {
  const { theme, accent } = useTheme();
  return (
    // Bridge: aktuelle Token-Werte für RN-Props in @apex/ui (placeholder, Icons, Spinner …)
    <UiColorsProvider value={buildUiColors(theme, accent)}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </UiColorsProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AppStack />
      </LocaleProvider>
    </ThemeProvider>
  );
}
