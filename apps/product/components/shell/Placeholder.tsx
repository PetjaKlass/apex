import { ScrollView, Text, View } from 'react-native';
import { useT } from '@/lib/i18n';
import { useWorkspace } from '@/lib/workspace';

/** Einheitliche Platzhalterseite bis die Feature-Phase die Route füllt. */
export function Placeholder({ featureKey, phase }: { featureKey: string; phase: number }) {
  const t = useT();
  const { active } = useWorkspace();
  return (
    <ScrollView contentContainerClassName="flex-1 items-center justify-center gap-3 p-6">
      <View className="from-accent-bright via-accent h-10 w-0.5 rounded-full bg-gradient-to-b to-transparent opacity-40" />
      <Text className="font-display text-fg-1 text-2xl font-bold tracking-tight">
        {t(`nav.${featureKey}`)}
      </Text>
      <Text className="text-fg-2 text-sm">
        {t('shell.placeholder', { feature: t(`nav.${featureKey}`) })}
      </Text>
      <View className="bg-subtle shadow-edge mt-2 rounded-full px-3 py-1">
        <Text className="text-fg-3 font-mono text-xs">{t('shell.soon', { n: phase })}</Text>
      </View>
      {active && <Text className="text-2xs text-fg-3 mt-4">Workspace: {active.name}</Text>}
    </ScrollView>
  );
}
