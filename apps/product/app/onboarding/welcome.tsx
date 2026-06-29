import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, Checkbox } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useOnboarding } from '@/lib/onboarding/store';
import { SplitScaffold } from '@/components/SplitScaffold';

export default function Welcome() {
  const t = useT();
  const router = useRouter();
  const { consent, set } = useOnboarding();

  return (
    <SplitScaffold
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
    </SplitScaffold>
  );
}
