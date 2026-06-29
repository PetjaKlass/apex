import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, GoldThread } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useOnboarding } from '@/lib/onboarding/store';

export default function Complete() {
  const t = useT();
  const router = useRouter();
  const reset = useOnboarding((s) => s.reset);

  // Zwischenstand aufräumen — Flow ist in der DB persistiert.
  useEffect(() => reset, [reset]);

  return (
    <SafeAreaView className="bg-canvas flex-1">
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-card border-hairline shadow-panel-edge web:backdrop-blur-xl w-full max-w-md items-center rounded-2xl border p-8">
          <GoldThread height={52} style={{ marginBottom: 26 }} />
          <Text className="font-display text-fg-1 text-center text-3xl font-bold tracking-tight">
            {t('onboarding.completeTitle')}
          </Text>
          <Text className="text-fg-2 mt-4 text-center text-base leading-relaxed">
            {t('onboarding.completeBody')}
          </Text>
          <View className="mt-9 w-full">
            <Button variant="primary" size="lg" onPress={() => router.replace('/dashboard')}>
              {t('onboarding.completeCta')}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
