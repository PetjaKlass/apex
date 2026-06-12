import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center">
        <View className="bg-accent mb-6 h-12 w-0.5 rounded-full" />
        <Text className="font-display text-fg-1 text-4xl font-bold tracking-tight">Apex</Text>
        <Text className="text-fg-2 mt-3 text-base">Product app — Phase 02</Text>
        <Link href="/dev/tokens" className="text-accent-text mt-8 text-sm">
          Dev: Token-Testseite →
        </Link>
      </View>
    </SafeAreaView>
  );
}
