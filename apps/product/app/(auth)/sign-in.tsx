import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, useToast } from '@apex/ui';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';

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
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center p-6">
        <View className="bg-accent mb-6 h-12 w-0.5 self-center rounded-full" />
        <Card header={t('auth.signInTitle')}>
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
            <Button variant="primary" loading={busy} onPress={() => void submit()}>
              {t('auth.signIn')}
            </Button>
            <View className="flex-row justify-between">
              <Link href="/reset-password" className="text-fg-3 text-xs">
                {t('auth.forgot')}
              </Link>
              <Link href="/sign-up" className="text-accent-text text-xs">
                {t('auth.signUp')}
              </Link>
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
