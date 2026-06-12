import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { accentNames } from '@apex/design-tokens';
import { useTheme } from '@/lib/theme';

const SWATCHES = [
  ['canvas', 'bg-canvas border border-strong'],
  ['card', 'bg-card'],
  ['subtle', 'bg-subtle'],
  ['accent', 'bg-accent'],
  ['accent-dim', 'bg-accent-dim'],
  ['success', 'bg-success'],
  ['warning', 'bg-warning'],
  ['danger', 'bg-danger'],
  ['info', 'bg-info'],
] as const;

export default function TokensTestScreen() {
  const { theme, setTheme, accent, setAccent } = useTheme();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerClassName="p-6">
        <Text className="text-2xs text-fg-3 font-semibold uppercase tracking-widest">
          Dev — Tokens
        </Text>
        <Text className="font-display text-fg-1 mt-2 text-xl font-bold tracking-tight">
          Theme: {theme} · Akzent: {accent}
        </Text>

        <View className="mt-6 flex-row flex-wrap gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-accent h-10 items-center justify-center rounded-full px-5 active:scale-95"
          >
            <Text className="text-accent-on text-sm font-semibold">Theme wechseln</Text>
          </Pressable>
        </View>

        <View className="mt-3 flex-row flex-wrap gap-2">
          {accentNames.map((a) => (
            <Pressable
              key={a}
              accessibilityRole="button"
              onPress={() => setAccent(a)}
              className={`border-strong h-10 items-center justify-center rounded-full border px-4 ${
                a === accent ? 'bg-accent-dim' : 'bg-card'
              }`}
            >
              <Text className={`text-sm ${a === accent ? 'text-accent-text' : 'text-fg-2'}`}>
                {a}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="bg-card shadow-card-edge mt-8 rounded-lg p-6">
          <Text className="text-fg-1 text-sm font-semibold">Flächen & Status</Text>
          <View className="mt-4 flex-row flex-wrap gap-3">
            {SWATCHES.map(([name, cls]) => (
              <View key={name} className="items-center gap-1">
                <View className={`h-12 w-16 rounded ${cls}`} />
                <Text className="text-2xs text-fg-3 font-mono">{name}</Text>
              </View>
            ))}
          </View>
          <Text className="text-fg-1 mt-6 text-base">Fließtext fg-1 — ruhig und präzise.</Text>
          <Text className="text-fg-2 text-sm">Sekundär fg-2 — AA-fest seit v4.1.</Text>
          <View className="mt-3 flex-row gap-2">
            <View className="bg-accent-dim rounded-full px-3 py-1">
              <Text className="text-accent-text text-xs font-medium">Akzent-Chip</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
