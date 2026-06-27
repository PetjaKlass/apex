import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Input } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { StepShell } from '@/components/onboarding/StepShell';
import { useOnboarding } from '@/lib/onboarding/store';

export default function Goal() {
  const t = useT();
  const router = useRouter();
  const { goalTitle, keyResult, set } = useOnboarding();

  return (
    <StepShell
      step="goal"
      eyebrow={t('onboarding.goalEyebrow')}
      title={t('onboarding.goalTitle')}
      subtitle={t('onboarding.goalSubtitle')}
      onContinue={() => router.push('/onboarding/habit')}
      onSkip={() => router.push('/onboarding/habit')}
    >
      <View className="gap-6">
        <Input
          label={t('onboarding.goalTitleField')}
          value={goalTitle}
          onChangeText={(v) => set('goalTitle', v)}
          placeholder={t('onboarding.goalTitlePh')}
        />
        <Input
          label={t('onboarding.goalKr')}
          value={keyResult}
          onChangeText={(v) => set('keyResult', v)}
          placeholder={t('onboarding.goalKrPh')}
        />
      </View>
    </StepShell>
  );
}
