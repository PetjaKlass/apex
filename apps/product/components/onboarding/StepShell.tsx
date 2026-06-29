import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, GoldThread, ProgressBar } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { STEPS, type Step } from '@/lib/onboarding/store';

/**
 * Cinema-Hülle je Onboarding-Schritt: Fortschritt über einer zentrierten
 * Floating-Glass-Karte (wie das Dashboard). Inhalt wird vertikal zentriert und
 * scrollt nur, wenn er die Höhe wirklich übersteigt — sonst alles auf einer Seite.
 */
export function StepShell({
  step,
  eyebrow,
  title,
  subtitle,
  children,
  onContinue,
  continueLabel,
  continueDisabled,
  onSkip,
  busy,
}: {
  step: Step;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  onSkip?: () => void;
  busy?: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const idx = STEPS.indexOf(step);

  return (
    <SafeAreaView className="bg-canvas flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 28,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md">
          {/* Fortschritt über der Karte */}
          <View className="mb-4 flex-row items-center gap-3">
            {idx > 0 && (
              <Button variant="ghost" size="sm" onPress={() => router.back()}>
                {t('common.back')}
              </Button>
            )}
            <View className="flex-1">
              <ProgressBar value={idx + 1} max={STEPS.length} />
            </View>
            <Text className="text-fg-3 font-mono text-xs">
              {idx + 1}/{STEPS.length}
            </Text>
          </View>

          {/* Floating-Glass-Karte */}
          <View className="bg-card border-hairline shadow-panel-edge web:backdrop-blur-xl rounded-2xl border p-7">
            <GoldThread height={36} dimmed style={{ marginBottom: 22 }} />
            {eyebrow && (
              <Text className="text-2xs text-accent-text font-semibold uppercase tracking-widest">
                {eyebrow}
              </Text>
            )}
            <Text className="font-display text-fg-1 mt-2 text-2xl font-bold tracking-tight">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-fg-2 mt-2.5 text-sm leading-relaxed">{subtitle}</Text>
            )}

            <View className="mt-7">{children}</View>

            <View className="mt-8 gap-2">
              <Button
                variant="primary"
                size="lg"
                loading={busy}
                disabled={continueDisabled}
                onPress={onContinue}
              >
                {continueLabel ?? t('common.continue')}
              </Button>
              {onSkip && (
                <Button variant="ghost" onPress={onSkip}>
                  {t('onboarding.skip')}
                </Button>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
