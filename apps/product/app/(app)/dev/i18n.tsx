import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency, formatDate, formatNumber } from '@apex/i18n';
import { useLocale } from '@/lib/i18n';

export default function I18nTestScreen() {
  const { locale, setLocale, t } = useLocale();
  const [count, setCount] = useState(1);
  const now = new Date();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerClassName="p-6">
        <Text className="text-2xs text-fg-3 font-semibold uppercase tracking-widest">
          {t('dev.i18nTitle')}
        </Text>
        <Text className="font-display text-fg-1 mt-2 text-xl font-bold tracking-tight">
          {t('greeting.morning', { name: 'Petja' })}
        </Text>

        <View className="mt-6 flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => setLocale(locale === 'de' ? 'en' : 'de')}
            className="bg-accent h-10 items-center justify-center rounded-full px-5 active:scale-95"
          >
            <Text className="text-accent-on text-sm font-semibold">{t('dev.switchLocale')}</Text>
          </Pressable>
          <Text className="text-fg-2 font-mono text-sm">{locale}</Text>
        </View>

        <View className="bg-card shadow-card-edge mt-8 rounded-lg p-6">
          <Text className="text-fg-1 text-sm font-semibold">Plural (ICU)</Text>
          <View className="mt-3 flex-row items-center gap-3">
            <Pressable
              accessibilityRole="button"
              onPress={() => setCount((c) => Math.max(0, c - 1))}
              className="bg-subtle h-10 w-10 items-center justify-center rounded-full"
            >
              <Text className="text-fg-1 font-mono">−</Text>
            </Pressable>
            <Text className="text-fg-1 min-w-32 text-center font-mono text-base">
              {t('tasks.count', { count })}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setCount((c) => c + 1)}
              className="bg-subtle h-10 w-10 items-center justify-center rounded-full"
            >
              <Text className="text-fg-1 font-mono">+</Text>
            </Pressable>
          </View>

          <Text className="text-fg-1 mt-6 text-sm font-semibold">Intl-Formate</Text>
          <Text className="text-fg-2 mt-2 font-mono text-sm">
            {t('dev.sampleDate')}: {formatDate(now, locale)}
          </Text>
          <Text className="text-fg-2 font-mono text-sm">
            {t('dev.sampleNumber')}: {formatNumber(1234.56, locale)}
          </Text>
          <Text className="text-fg-2 font-mono text-sm">
            {t('dev.sampleCurrency')}: {formatCurrency(12, locale, locale === 'de' ? 'EUR' : 'USD')}
          </Text>

          <Text className="text-fg-1 mt-6 text-sm font-semibold">Voice-Check</Text>
          <Text className="text-fg-2 mt-1 text-sm">
            {t('common.delete')} · {t('common.close')} · {t('status.offline')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
