import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ProgressBar } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { STEPS, type Step } from '@/lib/onboarding/store';

/**
 * Cinema-Hülle für jeden Onboarding-Schritt: Fortschritt oben, großzügiger Raum,
 * Footer mit Weiter/Überspringen. Goldener Faden gedimmt als Marke.
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
      <View className="mx-auto w-full max-w-md flex-1 px-6 pb-6 pt-4">
        <View className="flex-row items-center gap-3">
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

        <ScrollView className="mt-10 flex-1" keyboardShouldPersistTaps="handled">
          <View className="from-accent-bright via-accent mb-8 h-10 w-0.5 rounded-full bg-gradient-to-b to-transparent opacity-40" />
          {eyebrow && (
            <Text className="text-2xs text-accent-text font-semibold uppercase tracking-widest">
              {eyebrow}
            </Text>
          )}
          <Text className="font-display text-fg-1 mt-2 text-2xl font-bold tracking-tight">
            {title}
          </Text>
          {subtitle && <Text className="text-fg-2 mt-2 text-base">{subtitle}</Text>}
          <View className="mt-8">{children}</View>
        </ScrollView>

        <View className="gap-3 pt-4">
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
    </SafeAreaView>
  );
}
