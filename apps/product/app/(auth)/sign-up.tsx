import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input } from '@apex/ui';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';

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
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center p-6">
        <View className="bg-accent mb-6 h-12 w-0.5 self-center rounded-full" />
        <Card header={t('auth.signUpTitle')}>
          {confirmationSent ? (
            <Text className="text-fg-2 text-sm">{t('auth.confirmationSent')}</Text>
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
              <Button variant="primary" loading={busy} onPress={() => void submit()}>
                {t('auth.signUp')}
              </Button>
              <Link href="/sign-in" className="text-accent-text text-center text-xs">
                {t('auth.hasAccount')}
              </Link>
            </View>
          )}
        </Card>
      </View>
    </SafeAreaView>
  );
}
