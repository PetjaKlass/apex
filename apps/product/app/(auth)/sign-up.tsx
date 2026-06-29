import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Input } from '@apex/ui';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { SplitScaffold } from '@/components/SplitScaffold';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const t = useT();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(undefined);
    const res = await signUp(email.trim(), password);
    setBusy(false);
    if (res.error) setError(res.error);
    else if (res.needsConfirmation) setConfirmationSent(true);
    else router.replace('/');
  };

  return (
    <SplitScaffold title={t('auth.brandTitle')} subtitle={t('auth.brandPitch')}>
      <Text className="font-display text-fg-1 mb-7 text-2xl font-bold tracking-tight">
        {t('auth.signUpTitle')}
      </Text>
      {confirmationSent ? (
        <Text className="text-fg-2 text-base leading-relaxed">{t('auth.confirmationSent')}</Text>
      ) : (
        <View className="gap-4">
          <Input
            type="email"
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            autoComplete="email"
          />
          <Input
            type="password"
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            autoComplete="new-password"
            hint={t('auth.passwordHint')}
            error={error}
          />
          <Button variant="primary" size="lg" loading={busy} onPress={() => void submit()}>
            {t('auth.signUp')}
          </Button>
          <Link href="/sign-in" className="text-accent-text mt-1 text-center text-xs font-semibold">
            {t('auth.hasAccount')}
          </Link>
        </View>
      )}
    </SplitScaffold>
  );
}
