import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/lib/auth';
import { DbProvider } from '@/lib/powersync/DbProvider';
import { LocaleProvider } from '@/lib/i18n';
import { SkeletonProvider, ToastProvider, UiColorsProvider, buildUiColors } from '@apex/ui';
import { ThemeProvider, useTheme } from '@/lib/theme';
import '../global.css';

function AppStack() {
  const { theme, accent } = useTheme();
  return (
    // Bridge: aktuelle Token-Werte für RN-Props in @apex/ui (placeholder, Icons, Spinner …)
    <UiColorsProvider value={buildUiColors(theme, accent)}>
      <SkeletonProvider>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        </ToastProvider>
      </SkeletonProvider>
    </UiColorsProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <DbProvider>
            <AppStack />
          </DbProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
