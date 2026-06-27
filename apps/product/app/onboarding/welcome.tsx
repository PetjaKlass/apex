import { Link, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Checkbox } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useOnboarding } from '@/lib/onboarding/store';

export default function Welcome() {
  const t = useT();
  const router = useRouter();
  const { consent, set } = useOnboarding();

  return (
    <SafeAreaView className="bg-canvas flex-1">
      <View className="mx-auto w-full max-w-md flex-1 justify-center px-6">
        <View className="from-accent-bright via-accent mb-8 h-12 w-0.5 rounded-full bg-gradient-to-b to-transparent" />
        <Text className="text-2xs text-accent-text font-semibold uppercase tracking-widest">
          {t('onboarding.welcomeEyebrow')}
        </Text>
        <Text className="font-display text-fg-1 mt-3 text-3xl font-bold leading-tight tracking-tight">
          {t('onboarding.welcomeTitle')}
        </Text>
        <Text className="text-fg-2 mt-5 text-lg">{t('onboarding.welcomeBody')}</Text>

        <View className="mt-8">
          <Checkbox
            label={t('onboarding.consent', {})}
            checked={consent}
            onToggle={(v) => set('consent', v)}
          />
          <Text className="text-2xs text-fg-3 -mt-1 ml-8">
            <Link href="/(legal)/terms" className="underline">
              {t('common.continue')}
            </Link>
          </Text>
        </View>

        <View className="mt-8">
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
    </SafeAreaView>
  );
}
