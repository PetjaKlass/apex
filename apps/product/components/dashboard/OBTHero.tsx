/** OBTHero (docs/.../obt-hero.md) — trägt Signatur S1 (Goldener Faden). 4 Varianten. */
import { Text, View } from 'react-native';
import { Button, Chip } from '@apex/ui';
import { Clock, Folder, Timer } from 'lucide-react-native';
import { useT } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import type { Task } from '@/lib/data/dashboard';

type Phase = 'today' | 'done' | 'empty';

export function OBTHero({
  task,
  onComplete,
  onPick,
}: {
  task: Task | null;
  onComplete: () => void;
  onPick: () => void;
}) {
  const t = useT();
  const { colors, theme } = useTheme();
  const phase: Phase = !task ? 'empty' : task.status === 'done' ? 'done' : 'today';
  const isDark = theme === 'dark';

  return (
    <View
      className="relative overflow-hidden rounded-xl p-6"
      style={{
        backgroundColor: isDark ? '#121214' : '#16150F',
        borderWidth: 1,
        borderColor: isDark ? colors.accent.border : 'rgba(255,255,255,0.08)',
      }}
    >
      {/* S1: Goldener Faden, linke Innenkante — gedimmt im Empty-Zustand */}
      <View
        className="from-accent-bright via-accent absolute bottom-0 left-0 top-0 w-0.5 rounded-full bg-gradient-to-b to-transparent"
        style={{ opacity: phase === 'empty' ? 0.4 : 1 }}
      />
      <View
        className="absolute right-0 top-0 h-40 w-72"
        style={{ backgroundColor: colors.accent.glow, opacity: 0.5 }}
      />

      <Text
        className="text-2xs font-semibold uppercase tracking-widest"
        style={{ color: colors.accent.bright }}
      >
        {t('tasks.obt')}
      </Text>

      {phase === 'empty' ? (
        <>
          <Text
            className="font-display mt-3 text-2xl font-bold tracking-tight"
            style={{ color: 'rgba(255,250,238,0.95)' }}
          >
            {t('dashboard.obtEmptyTitle')}
          </Text>
          <View className="mt-5 flex-row gap-3">
            <Button variant="primary" onPress={onPick}>
              {t('dashboard.obtPick')}
            </Button>
          </View>
        </>
      ) : (
        <>
          <Text
            className="font-display mt-3 text-2xl font-bold tracking-tight"
            style={{
              color: phase === 'done' ? 'rgba(255,250,238,0.55)' : 'rgba(255,250,238,0.95)',
              textDecorationLine: phase === 'done' ? 'line-through' : 'none',
            }}
          >
            {task?.title}
          </Text>
          <View className="mb-5 mt-3 flex-row flex-wrap gap-2">
            <View
              className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
            >
              <Folder size={11} color="rgba(255,250,238,0.55)" />
              <Text className="text-xs" style={{ color: 'rgba(255,250,238,0.55)' }}>
                Apex
              </Text>
            </View>
            {task?.estimated_minutes ? (
              <View
                className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
              >
                <Clock size={11} color="rgba(255,250,238,0.55)" />
                <Text className="font-mono text-xs" style={{ color: 'rgba(255,250,238,0.55)' }}>
                  {task.estimated_minutes} min
                </Text>
              </View>
            ) : null}
          </View>
          <View className="flex-row gap-3">
            {phase === 'today' && (
              <Button variant="primary" icon={Timer} onPress={onComplete}>
                {t('common.done')}
              </Button>
            )}
            {phase === 'done' && <Chip label={t('status.synced')} dot="success" />}
          </View>
        </>
      )}
    </View>
  );
}
