import { Link, Redirect } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Chip, Skeleton } from '@apex/ui';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';

export default function HomeScreen() {
  const { session, profile, loading, signOut } = useAuth();
  const t = useT();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-6">
        <Skeleton.Container>
          <Skeleton.Avatar size={40} />
          <Skeleton.Text lines={2} width="60%" />
        </Skeleton.Container>
      </SafeAreaView>
    );
  }
  if (!session) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center gap-4 p-6">
        <View className="bg-accent h-12 w-0.5 rounded-full" />
        <Avatar name={profile?.display_name ?? session.user.email ?? '?'} self size="xl" />
        <Text className="font-display text-fg-1 text-2xl font-bold tracking-tight">
          {t('greeting.morning', { name: profile?.display_name ?? '…' })}
        </Text>
        <Chip label={t('status.synced')} dot="success" />
        <Text className="text-fg-3 text-xs">{session.user.email}</Text>
        <View className="mt-6 flex-row flex-wrap items-center justify-center gap-3">
          <Link href="/dev/components" className="text-accent-text text-sm">
            Dev: Components →
          </Link>
          <Link href="/dev/db" className="text-accent-text text-sm">
            DB →
          </Link>
          <Link href="/dev/tokens" className="text-accent-text text-sm">
            Tokens →
          </Link>
          <Link href="/dev/i18n" className="text-accent-text text-sm">
            i18n →
          </Link>
        </View>
        <Button variant="ghost" onPress={() => void signOut()}>
          {t('auth.signOut')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
