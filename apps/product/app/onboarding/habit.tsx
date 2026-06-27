import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Input, RadioGroup } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { StepShell } from '@/components/onboarding/StepShell';
import { useOnboarding, type FrequencyType } from '@/lib/onboarding/store';

export default function Habit() {
  const t = useT();
  const router = useRouter();
  const { habitTitle, habitIdentity, habitFrequency, set } = useOnboarding();

  return (
    <StepShell
      step="habit"
      eyebrow={t('onboarding.habitEyebrow')}
      title={t('onboarding.habitTitle')}
      subtitle={t('onboarding.habitSubtitle')}
      onContinue={() => router.push('/onboarding/obt')}
      onSkip={() => router.push('/onboarding/obt')}
    >
      <View className="gap-6">
        <Input
          label={t('onboarding.habitTitleField')}
          value={habitTitle}
          onChangeText={(v) => set('habitTitle', v)}
          placeholder={t('onboarding.habitTitlePh')}
        />
        <Input
          label={t('onboarding.habitIdentity')}
          value={habitIdentity}
          onChangeText={(v) => set('habitIdentity', v)}
          placeholder={t('onboarding.habitIdentityPh')}
        />
        <RadioGroup
          legend={t('onboarding.habitFrequency')}
          value={habitFrequency}
          onChange={(v) => set('habitFrequency', v as FrequencyType)}
          options={[
            { value: 'daily', label: t('onboarding.freqDaily') },
            { value: 'x_per_week', label: t('onboarding.freqXWeek') },
            { value: 'weekly', label: t('onboarding.freqWeekly') },
          ]}
        />
      </View>
    </StepShell>
  );
}
