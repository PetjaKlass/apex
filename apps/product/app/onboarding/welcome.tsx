import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, Checkbox } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useOnboarding } from '@/lib/onboarding/store';
import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';

export default function Welcome() {
  const t = useT();
  const router = useRouter();
  const { consent, set } = useOnboarding();

  return (
    <OnboardingScaffold
      eyebrow={t('onboarding.welcomeEyebrow')}
      title={t('onboarding.welcomeTitle')}
      subtitle={t('onboarding.welcomeBody')}
    >
      <Checkbox
        label={t('onboarding.consent')}
        checked={consent}
        onToggle={(v) => set('consent', v)}
      />
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
    </OnboardingScaffold>
  );
}
