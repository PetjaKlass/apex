import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useT } from '@/lib/i18n';

export default function HomeScreen() {
  const t = useT();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center">
        <View className="bg-accent mb-6 h-12 w-0.5 rounded-full" />
        <Text className="font-display text-fg-1 text-4xl font-bold tracking-tight">
          {t('common.appName')}
        </Text>
        <Text className="text-fg-2 mt-3 px-8 text-center text-base">{t('common.tagline')}</Text>
        <Link href="/dev/tokens" className="text-accent-text mt-8 text-sm">
          Dev: Tokens →
        </Link>
        <Link href="/dev/i18n" className="text-accent-text mt-2 text-sm">
          Dev: i18n →
        </Link>
        <Link href="/dev/components" className="text-accent-text mt-2 text-sm">
          Dev: Components →
        </Link>
      </View>
    </SafeAreaView>
  );
}
