import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input } from '@apex/ui';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';

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
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center p-6">
        <Card header={t('auth.resetTitle')}>
          {sent ? (
            <Text className="text-fg-2 text-sm">{t('auth.resetSent')}</Text>
          ) : (
            <View className="gap-4">
              <Input
                type="email"
                label={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                error={error}
              />
              <Button variant="primary" loading={busy} onPress={() => void submit()}>
                {t('auth.reset')}
              </Button>
            </View>
          )}
          <Link href="/sign-in" className="text-accent-text mt-4 text-center text-xs">
            {t('auth.signIn')}
          </Link>
        </Card>
      </View>
    </SafeAreaView>
  );
}
