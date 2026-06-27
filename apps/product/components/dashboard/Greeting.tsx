import { Text, View } from 'react-native';
import { formatDate } from '@apex/i18n';
import { useLocale } from '@/lib/i18n';

/** Zeit- und locale-bewusste Begrüßung + heutiges Datum. */
export function Greeting({ name }: { name: string }) {
  const { locale, t } = useLocale();
  const h = new Date().getHours();
  const slot = h >= 5 && h < 12 ? 'morning' : h >= 12 && h < 18 ? 'afternoon' : 'evening';
  const dateStr = formatDate(new Date(), locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View>
      <Text className="text-2xs text-fg-3 font-semibold uppercase tracking-widest">{dateStr}</Text>
      <Text className="font-display text-fg-1 mt-2 text-[32px] font-bold tracking-tight">
        {t(`greeting.${slot}`, { name })}
      </Text>
    </View>
  );
}
