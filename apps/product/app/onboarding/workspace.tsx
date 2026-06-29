import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { cn, Input, Segmented } from '@apex/ui';
import { accentNames } from '@apex/design-tokens';
import { useT } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { StepShell } from '@/components/onboarding/StepShell';
import { useOnboarding } from '@/lib/onboarding/store';

const ACCENT_HEX: Record<string, string> = {
  gold: '#C9993A',
  silver: '#8B9AAB',
  rose: '#C4707A',
  sapphire: '#4A7FA5',
  emerald: '#3A7D58',
};

export default function Workspace() {
  const t = useT();
  const router = useRouter();
  const { accent, setAccent } = useTheme();
  const { workspaceName, workspaceType, set } = useOnboarding();

  return (
    <StepShell
      step="workspace"
      eyebrow={t('onboarding.workspaceEyebrow')}
      title={t('onboarding.workspaceTitle')}
      subtitle={t('onboarding.workspaceSubtitle')}
      continueDisabled={!workspaceName.trim()}
      onContinue={() => router.push('/onboarding/vision')}
    >
      <View className="gap-6">
        <Input
          label={t('onboarding.workspaceName')}
          value={workspaceName}
          onChangeText={(v) => set('workspaceName', v)}
          placeholder="Personal"
        />
        <Segmented
          legend={t('onboarding.workspaceTypeLegend')}
          value={workspaceType}
          onChange={(v) => set('workspaceType', v as 'solo' | 'duo')}
          options={[
            { value: 'solo', label: t('onboarding.workspaceTypeSolo') },
            { value: 'duo', label: t('onboarding.workspaceTypeDuo') },
          ]}
        />
        <View>
          <Text className="text-2xs text-fg-2 mb-2 font-semibold">
            {t('onboarding.workspaceAccent')}
          </Text>
          <View className="flex-row gap-3">
            {accentNames.map((a) => (
              <Pressable
                key={a}
                accessibilityRole="button"
                accessibilityLabel={a}
                accessibilityState={{ selected: accent === a }}
                onPress={() => setAccent(a)}
                className={cn(
                  'h-9 w-9 items-center justify-center rounded-full',
                  'web:transition-transform web:duration-fast web:hover:scale-110 web:cursor-pointer',
                  accent === a && 'border-fg-1 border-2'
                )}
              >
                <View
                  style={{
                    backgroundColor: ACCENT_HEX[a],
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                  }}
                />
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </StepShell>
  );
}
