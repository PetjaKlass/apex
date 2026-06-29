import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Input, Segmented, Textarea } from '@apex/ui';
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
          maxHeight={132}
        />
        <Segmented
          legend={t('onboarding.visionHorizon')}
          value={visionHorizon}
          onChange={(v) => set('visionHorizon', v as Horizon)}
          options={[
            { value: '1y', label: t('onboarding.horizon1y') },
            { value: '3y', label: t('onboarding.horizon3y') },
            { value: '5y', label: t('onboarding.horizon5y') },
          ]}
        />
      </View>
    </StepShell>
  );
}
