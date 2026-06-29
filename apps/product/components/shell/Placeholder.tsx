import { Text, View } from 'react-native';
import { useUiColors } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { NAV } from './nav';

/** Branded Empty-State bis die Feature-Phase die Route füllt — bewusst, nicht „leer". */
export function Placeholder({ featureKey, phase }: { featureKey: string; phase: number }) {
  const t = useT();
  const c = useUiColors();
  const entry = NAV.find((n) => n.key === featureKey);
  const Icon = entry?.icon;

  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="bg-accent-dim border-accent-border h-16 w-16 items-center justify-center rounded-2xl border">
        {Icon && <Icon size={26} color={c.accent} strokeWidth={1.75} />}
      </View>
      <Text className="font-display text-fg-1 mt-6 text-2xl font-bold tracking-tight">
        {t(`nav.${featureKey}`)}
      </Text>
      <Text className="text-fg-2 mt-2 max-w-xs text-center text-sm leading-relaxed">
        {t('shell.placeholder', { feature: t(`nav.${featureKey}`) })}
      </Text>
      <View className="bg-subtle border-hairline mt-5 flex-row items-center gap-2 rounded-full border px-3 py-1.5">
        <View className="bg-accent h-1.5 w-1.5 rounded-full" />
        <Text className="text-fg-3 font-mono text-xs">{t('shell.soon', { n: phase })}</Text>
      </View>
    </View>
  );
}
