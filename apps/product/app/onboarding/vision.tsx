import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Input, RadioGroup, Textarea } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { StepShell } from '@/components/onboarding/StepShell';
import { useOnboarding, type Horizon } from '@/lib/onboarding/store';

export default function Vision() {
  const t = useT();
  const router = useRouter();
  const { visionTitle, visionStatement, visionHorizon, set } = useOnboarding();

  return (
    <StepShell
      step="vision"
      eyebrow={t('onboarding.visionEyebrow')}
      title={t('onboarding.visionTitle')}
      subtitle={t('onboarding.visionSubtitle')}
      onContinue={() => router.push('/onboarding/goal')}
      onSkip={() => router.push('/onboarding/goal')}
    >
      <View className="gap-6">
        <Input
          label={t('onboarding.visionTitleField')}
          value={visionTitle}
          onChangeText={(v) => set('visionTitle', v)}
          placeholder={t('onboarding.visionTitlePh')}
        />
        <Textarea
          label={t('onboarding.visionStatement')}
          value={visionStatement}
          onChangeText={(v) => set('visionStatement', v)}
          placeholder={t('onboarding.visionStatementPh')}
          maxLength={280}
        />
        <RadioGroup
          legend={t('onboarding.visionHorizon')}
          value={visionHorizon}
          onChange={(v) => set('visionHorizon', v as Horizon)}
          options={[
            { value: '1y', label: '1' },
            { value: '3y', label: '3' },
            { value: '5y', label: '5' },
          ]}
        />
      </View>
    </StepShell>
  );
}
