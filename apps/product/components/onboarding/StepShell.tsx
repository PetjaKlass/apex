import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { STEPS, type Step } from '@/lib/onboarding/store';
import { OnboardingScaffold } from './OnboardingScaffold';

/** Schritt-Hülle: delegiert das Split-Layout an OnboardingScaffold, rendert Footer-Aktionen. */
export function StepShell({
  step,
  eyebrow,
  title,
  subtitle,
  children,
  onContinue,
  continueLabel,
  continueDisabled,
  onSkip,
  busy,
}: {
  step: Step;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  onSkip?: () => void;
  busy?: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const idx = STEPS.indexOf(step);

  return (
    <OnboardingScaffold
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      progress={{ index: idx + 1, total: STEPS.length }}
      onBack={idx > 0 ? () => router.back() : undefined}
    >
      {children}
      <View className="mt-8 gap-2">
        <Button
          variant="primary"
          size="lg"
          loading={busy}
          disabled={continueDisabled}
          onPress={onContinue}
        >
          {continueLabel ?? t('common.continue')}
        </Button>
        {onSkip && (
          <Button variant="ghost" onPress={onSkip}>
            {t('onboarding.skip')}
          </Button>
        )}
      </View>
    </OnboardingScaffold>
  );
}
