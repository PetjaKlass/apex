import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useOnboarding } from '@/lib/onboarding/store';

export default function Complete() {
  const t = useT();
  const router = useRouter();
  const reset = useOnboarding((s) => s.reset);

  // Zwischenstand aufräumen — Flow ist persistiert in DB.
  useEffect(() => reset, [reset]);

  return (
    <SafeAreaView className="bg-canvas flex-1">
      <View className="mx-auto w-full max-w-md flex-1 items-center justify-center px-6 text-center">
        <View className="from-accent-bright via-accent mb-8 h-14 w-0.5 rounded-full bg-gradient-to-b to-transparent" />
        <Text className="font-display text-fg-1 text-3xl font-bold tracking-tight">
          {t('onboarding.completeTitle')}
        </Text>
        <Text className="text-fg-2 mt-4 text-center text-lg">{t('onboarding.completeBody')}</Text>
        <View className="mt-10 w-full">
          <Button variant="primary" size="lg" onPress={() => router.replace('/dashboard')}>
            {t('onboarding.completeCta')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
