import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Checkbox, GoldThread } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useOnboarding } from '@/lib/onboarding/store';

export default function Welcome() {
  const t = useT();
  const router = useRouter();
  const { consent, set } = useOnboarding();

  return (
    <SafeAreaView className="bg-canvas flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 28,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-card border-hairline shadow-panel-edge web:backdrop-blur-xl w-full max-w-md rounded-2xl border p-8">
          <GoldThread height={44} style={{ marginBottom: 26 }} />
          <Text className="text-2xs text-accent-text font-semibold uppercase tracking-widest">
            {t('onboarding.welcomeEyebrow')}
          </Text>
          <Text className="font-display text-fg-1 mt-3 text-3xl font-bold leading-tight tracking-tight">
            {t('onboarding.welcomeTitle')}
          </Text>
          <Text className="text-fg-2 mt-4 text-base leading-relaxed">
            {t('onboarding.welcomeBody')}
          </Text>

          <View className="mt-7">
            <Checkbox
              label={t('onboarding.consent')}
              checked={consent}
              onToggle={(v) => set('consent', v)}
            />
          </View>

          <View className="mt-7">
            <Button
              variant="primary"
              size="lg"
              disabled={!consent}
              onPress={() => router.push('/onboarding/identity')}
            >
              {t('onboarding.welcomeCta')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
