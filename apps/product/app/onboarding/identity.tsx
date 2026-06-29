import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Input } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { StepShell } from '@/components/onboarding/StepShell';
import { IdentityCard } from '@/components/onboarding/IdentityCard';
import { useOnboarding } from '@/lib/onboarding/store';

const KEYS = ['founder', 'operator', 'creator', 'athlete', 'builder'] as const;

export default function Identity() {
  const t = useT();
  const router = useRouter();
  const { identity, set } = useOnboarding();
  const isCustom = identity !== null && !KEYS.includes(identity as (typeof KEYS)[number]);

  return (
    <StepShell
      step="identity"
      eyebrow={t('onboarding.identityEyebrow')}
      title={t('onboarding.identityTitle')}
      subtitle={t('onboarding.identitySubtitle')}
      continueDisabled={!identity}
      onContinue={() => router.push('/onboarding/workspace')}
      onSkip={() => router.push('/onboarding/workspace')}
    >
      <View className="gap-4">
        {KEYS.map((k) => (
          <IdentityCard
            key={k}
            label={t(`onboarding.identityOptions.${k}.label`)}
            description={t(`onboarding.identityOptions.${k}.desc`)}
            selected={identity === k}
            onPress={() => set('identity', k)}
          />
        ))}
        <View className="mt-2">
          <Input
            label={t('onboarding.identityCustom')}
            value={isCustom ? (identity ?? '') : ''}
            onChangeText={(v) => set('identity', v || null)}
            placeholder="…"
          />
        </View>
      </View>
    </StepShell>
  );
}
