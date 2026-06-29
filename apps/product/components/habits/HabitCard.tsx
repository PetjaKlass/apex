/** HabitCard — PLATZHALTER (volle Logik: Phase 15). Dashboard-Mini: heute erledigt? */
import { Pressable, Text, View } from 'react-native';
import { Check, Flame } from 'lucide-react-native';
import { cn } from '@apex/ui';
import { useTheme } from '@/lib/theme';
import type { Habit } from '@/lib/data/dashboard';

export function HabitCard({
  habit,
  doneToday,
  onToggle,
}: {
  habit: Habit;
  doneToday: boolean;
  onToggle?: (id: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <View className="bg-card border-hairline shadow-card-edge rounded-lg border p-4">
      <View className="flex-row items-start gap-3">
        <View className="bg-subtle shadow-edge h-9 w-9 items-center justify-center rounded-[14px]">
          <Flame size={16} color={colors.fg2} />
        </View>
        <View className="flex-1">
          <Text className="text-fg-1 text-sm font-semibold" numberOfLines={1}>
            {habit.title}
          </Text>
          <Text className="text-fg-3 text-xs" numberOfLines={1}>
            {habit.identity_statement}
          </Text>
        </View>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: doneToday }}
          accessibilityLabel={habit.title}
          onPress={() => onToggle?.(habit.id)}
          hitSlop={6}
          className={cn(
            'h-6 w-6 items-center justify-center rounded-full border-[1.5px]',
            doneToday ? 'border-accent bg-accent' : 'border-border-strong'
          )}
        >
          {doneToday && <Check size={13} color={colors.accent.onAccent} strokeWidth={2.5} />}
        </Pressable>
      </View>
    </View>
  );
}
