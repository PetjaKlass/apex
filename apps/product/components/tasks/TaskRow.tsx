/** TaskRow — PLATZHALTER (volle Interaktion: Phase 14). Read-only Anzeige fürs Dashboard. */
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { cn } from '@apex/ui';
import { useTheme } from '@/lib/theme';
import type { Task } from '@/lib/data/dashboard';

const PRIO: Record<string, string> = {
  high: 'text-danger-fg',
  medium: 'text-warning-fg',
  low: 'text-fg-3',
};

export function TaskRow({ task, onToggle }: { task: Task; onToggle?: (id: string) => void }) {
  const { colors } = useTheme();
  const done = task.status === 'done';
  return (
    <View className="border-border flex-row items-start gap-3 border-t py-3 first:border-t-0">
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={task.title}
        onPress={() => onToggle?.(task.id)}
        hitSlop={6}
        className={cn(
          'mt-0.5 h-5 w-5 items-center justify-center rounded-full border-[1.5px]',
          done ? 'border-accent bg-accent' : 'border-border-strong'
        )}
      >
        {done && <Check size={12} color={colors.accent.onAccent} strokeWidth={2.5} />}
      </Pressable>
      <View className="flex-1">
        <Text
          className={cn('text-sm', done ? 'text-fg-3 line-through' : 'text-fg-1')}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <View className="mt-1 flex-row flex-wrap items-center gap-2">
          <Text className={cn('text-xs font-medium', PRIO[task.priority] ?? 'text-fg-3')}>
            {task.priority === 'high' ? 'Hoch' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
          </Text>
          {task.tags.slice(0, 2).map((tag) => (
            <Text key={tag} className="bg-subtle text-2xs text-fg-2 rounded-full px-2 py-0.5">
              {tag}
            </Text>
          ))}
          {task.estimated_minutes ? (
            <Text className="text-2xs text-fg-3 font-mono">{task.estimated_minutes} min</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
