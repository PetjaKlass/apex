import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Input, useToast } from '@apex/ui';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { SplitScaffold } from '@/components/SplitScaffold';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const t = useT();
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(undefined);
    const res = await signIn(email.trim(), password);
    setBusy(false);
    if (res.error) setError(res.error);
    else {
      toast.show({ type: 'success', message: t('auth.welcomeBack') });
      router.replace('/');
    }
  };

  return (
    <SplitScaffold title={t('auth.brandTitle')} subtitle={t('auth.brandPitch')}>
      <Text className="font-display text-fg-1 mb-7 text-2xl font-bold tracking-tight">
        {t('auth.signInTitle')}
      </Text>
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
          autoComplete="current-password"
          error={error}
          onSubmitEditing={() => void submit()}
          returnKeyType="go"
        />
        <Button variant="primary" size="lg" loading={busy} onPress={() => void submit()}>
          {t('auth.signIn')}
        </Button>
        <View className="mt-1 flex-row justify-between">
          <Link href="/reset-password" className="text-fg-3 text-xs">
            {t('auth.forgot')}
          </Link>
          <Link href="/sign-up" className="text-accent-text text-xs font-semibold">
            {t('auth.signUp')}
          </Link>
        </View>
      </View>
    </SplitScaffold>
  );
}
