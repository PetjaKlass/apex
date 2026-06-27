import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Input, useToast } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useWorkspace } from '@/lib/workspace';
import { StepShell } from '@/components/onboarding/StepShell';
import { useOnboarding } from '@/lib/onboarding/store';
import { submitOnboarding } from '@/lib/onboarding/submit';

export default function Obt() {
  const t = useT();
  const router = useRouter();
  const toast = useToast();
  const { session } = useAuth();
  const { active } = useWorkspace();
  const data = useOnboarding();
  const { obtTitle, set } = data;
  const [busy, setBusy] = useState(false);

  const finish = async () => {
    if (!session || !active) return;
    setBusy(true);
    try {
      await submitOnboarding(data, session.user.id, active.id);
      router.replace('/onboarding/complete');
    } catch (e) {
      setBusy(false);
      toast.show({
        type: 'error',
        message: t('status.error'),
        sub: e instanceof Error ? e.message : undefined,
      });
    }
  };

  return (
    <StepShell
      step="obt"
      eyebrow={t('onboarding.obtEyebrow')}
      title={t('onboarding.obtTitle')}
      subtitle={t('onboarding.obtSubtitle')}
      continueLabel={t('onboarding.completeCta')}
      busy={busy}
      onContinue={() => void finish()}
    >
      <Input
        label={t('onboarding.obtField')}
        value={obtTitle}
        onChangeText={(v) => set('obtTitle', v)}
        placeholder={t('onboarding.obtPh')}
      />
    </StepShell>
  );
}
