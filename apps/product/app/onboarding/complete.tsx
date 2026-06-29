import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useOnboarding } from '@/lib/onboarding/store';
import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';

export default function Complete() {
  const t = useT();
  const router = useRouter();
  const reset = useOnboarding((s) => s.reset);

  // Zwischenstand aufräumen — Flow ist in der DB persistiert.
  useEffect(() => reset, [reset]);

  return (
    <OnboardingScaffold
      eyebrow={t('onboarding.completeEyebrow')}
      title={t('onboarding.completeTitle')}
      subtitle={t('onboarding.completeBody')}
    >
      <Button variant="primary" size="lg" onPress={() => router.replace('/dashboard')}>
        {t('onboarding.completeCta')}
      </Button>
    </OnboardingScaffold>
  );
}
