import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, GoldThread } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

/**
 * Award-Tier-Onboarding-Hülle: Split-Screen auf Desktop (Marke + Frage im dunklen
 * Panel links, Eingaben rechts, volle Bildbreite), Einspaltig auf Mobil.
 * Vereinheitlicht ALLE Onboarding-Screens (welcome … complete) → ein konsistentes Bild.
 */
export function OnboardingScaffold({
  eyebrow,
  title,
  subtitle,
  progress,
  onBack,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  progress?: { index: number; total: number };
  onBack?: () => void;
  children: React.ReactNode;
}) {
  const t = useT();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { width } = useWindowDimensions();
  const wide = width >= 1024;
  const pct = progress ? Math.round((progress.index / progress.total) * 100) : 0;

  const Brand = (
    <View className="flex-row items-center gap-2.5">
      <GoldThread height={20} />
      <Text className="font-display text-hero-text text-sm font-bold tracking-widest">APEX</Text>
    </View>
  );

  // ---- DESKTOP: Split-Screen ----
  if (wide) {
    return (
      <View className="bg-canvas flex-1 flex-row">
        {/* Linkes Marken-/Frage-Panel (dunkel) */}
        <View
          className="relative justify-between overflow-hidden p-14"
          style={{ flex: 4, backgroundColor: isDark ? '#121214' : '#16150F' }}
        >
          <View
            className="bg-accent-glow absolute -right-16 -top-16 h-72 w-72 rounded-full"
            style={{ opacity: 0.5 }}
            aria-hidden
          />
          {Brand}
          <View className="max-w-lg">
            {eyebrow && (
              <Text className="text-2xs text-accent-bright font-semibold uppercase tracking-widest">
                {eyebrow}
              </Text>
            )}
            <Text className="font-display text-hero-text mt-4 text-5xl font-bold tracking-tight">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-hero-text2 mt-5 max-w-md text-lg leading-relaxed">
                {subtitle}
              </Text>
            )}
          </View>
          {progress ? (
            <View className="flex-row items-center gap-4">
              <View className="bg-hero-border h-1 flex-1 overflow-hidden rounded-full">
                <View className="bg-accent h-1 rounded-full" style={{ width: `${pct}%` }} />
              </View>
              <Text className="text-hero-text2 font-mono text-xs">
                {progress.index}/{progress.total}
              </Text>
            </View>
          ) : (
            <View className="h-1" />
          )}
        </View>

        {/* Rechte Eingaben-Spalte (hell) */}
        <View style={{ flex: 6 }}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: 64,
              paddingVertical: 48,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="w-full self-center" style={{ maxWidth: 440 }}>
              {onBack && (
                <View className="-ml-2 mb-6 flex-row">
                  <Button variant="ghost" size="sm" onPress={onBack}>
                    {t('common.back')}
                  </Button>
                </View>
              )}
              {children}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  // ---- MOBIL: Einspaltig ----
  return (
    <SafeAreaView className="bg-canvas flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 flex-row items-center justify-between">
          {Brand}
          {progress && (
            <Text className="text-fg-3 font-mono text-xs">
              {progress.index}/{progress.total}
            </Text>
          )}
        </View>
        {progress && (
          <View className="bg-subtle mb-8 h-1 overflow-hidden rounded-full">
            <View className="bg-accent h-1 rounded-full" style={{ width: `${pct}%` }} />
          </View>
        )}
        <View className="flex-1 justify-center">
          {eyebrow && (
            <Text className="text-2xs text-accent-text font-semibold uppercase tracking-widest">
              {eyebrow}
            </Text>
          )}
          <Text className="font-display text-fg-1 mt-2 text-3xl font-bold leading-tight tracking-tight">
            {title}
          </Text>
          {subtitle && <Text className="text-fg-2 mt-3 text-base leading-relaxed">{subtitle}</Text>}
          <View className="mt-8">{children}</View>
        </View>
        {onBack && (
          <View className="mt-6 items-start">
            <Button variant="ghost" size="sm" onPress={onBack}>
              {t('common.back')}
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
