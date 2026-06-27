import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useT } from '@/lib/i18n';

export default function NotFound() {
  const t = useT();
  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-3 p-6">
      <View className="from-accent-bright via-accent h-10 w-0.5 rounded-full bg-gradient-to-b to-transparent opacity-40" />
      <Text className="font-display text-fg-1 text-2xl font-bold tracking-tight">404</Text>
      <Link href="/dashboard" className="text-accent-text mt-2 text-sm">
        {t('nav.dashboard')} →
      </Link>
    </SafeAreaView>
  );
}
