import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '@apex/ui';
import { useAuth } from '@/lib/auth';

export default function Index() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-sm">
          <Skeleton.Container>
            <Skeleton.Avatar size={40} />
            <Skeleton.Text lines={2} width="60%" />
          </Skeleton.Container>
        </View>
      </SafeAreaView>
    );
  }
  return <Redirect href={session ? '/dashboard' : '/sign-in'} />;
}
