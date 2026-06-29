import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Input } from '@apex/ui';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { SplitScaffold } from '@/components/SplitScaffold';

export default function ResetScreen() {
  const { resetRequest } = useAuth();
  const t = useT();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const res = await resetRequest(email.trim());
    setBusy(false);
    if (res.error) setError(res.error);
    else setSent(true);
  };

  return (
    <SplitScaffold title={t('auth.brandTitle')} subtitle={t('auth.brandPitch')}>
      <Text className="font-display text-fg-1 mb-7 text-2xl font-bold tracking-tight">
        {t('auth.resetTitle')}
      </Text>
      {sent ? (
        <Text className="text-fg-2 text-base leading-relaxed">{t('auth.resetSent')}</Text>
      ) : (
        <View className="gap-4">
          <Input
            type="email"
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            error={error}
          />
          <Button variant="primary" size="lg" loading={busy} onPress={() => void submit()}>
            {t('auth.reset')}
          </Button>
        </View>
      )}
      <View className="mt-5">
        <Link href="/sign-in" className="text-accent-text text-center text-xs font-semibold">
          {t('auth.signIn')}
        </Link>
      </View>
    </SplitScaffold>
  );
}
