import { Link } from 'expo-router';
import { GoldThread } from '@apex/ui';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useT } from '@/lib/i18n';

export default function NotFound() {
  const t = useT();
  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-3 p-6">
      <GoldThread height={40} dimmed />
      <Text className="font-display text-fg-1 text-2xl font-bold tracking-tight">404</Text>
      <Link href="/dashboard" className="text-accent-text mt-2 text-sm">
        {t('nav.dashboard')} →
      </Link>
    </SafeAreaView>
  );
}
