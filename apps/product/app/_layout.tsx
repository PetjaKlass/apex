import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LocaleProvider } from '@/lib/i18n';
import { ThemeProvider, useTheme } from '@/lib/theme';
import '../global.css';

function AppStack() {
  const { theme } = useTheme();
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
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
