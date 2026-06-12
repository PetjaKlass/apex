/** Badge-Familie: Chip, Tag, Delta, Count (badge.md). Farbe = Information (S2/S3). */
import { Platform, Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { cn } from '../cn';
import { useUiColors } from '../theme';

export type ChipProps = {
  label?: string;
  dot?: 'success' | 'warning' | 'danger' | 'onhold' | 'accent' | 'info';
  variant?: 'default' | 'accent';
  onPress?: () => void;
  accessibilityLabel?: string;
};

const DOT_CLASS: Record<NonNullable<ChipProps['dot']>, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  onhold: 'bg-onhold',
  info: 'bg-info',
  accent: 'bg-accent',
};

export function Chip({ label, dot, variant = 'default', onPress, accessibilityLabel }: ChipProps) {
  const inner = (
    <>
      {dot && <View className={cn('h-[7px] w-[7px] rounded-full', DOT_CLASS[dot])} />}
      {label && (
        <Text
          className={cn(
            'text-xs font-medium',
            variant === 'accent' ? 'text-accent-text' : 'text-fg-2'
          )}
        >
          {label}
        </Text>
      )}
    </>
  );
  const box = cn(
    'h-[26px] flex-row items-center gap-[6px] self-start rounded-full px-2.5',
    variant === 'accent' ? 'bg-accent-dim' : 'border border-border bg-card-glass shadow-edge'
  );
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        onPress={onPress}
        className={box}
      >
        {inner}
      </Pressable>
    );
  }
  return (
    <View
      className={box}
      {...(Platform.OS === 'web' && !label ? { 'aria-label': accessibilityLabel } : {})}
    >
      {inner}
    </View>
  );
}

export type TagProps = { label: string; onRemove?: () => void; onPress?: () => void };

export function Tag({ label, onRemove, onPress }: TagProps) {
  const c = useUiColors();
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      {...(onPress ? { accessibilityRole: 'button' as const, onPress } : {})}
      className="bg-subtle h-[22px] flex-row items-center gap-1 self-start rounded-full px-2"
    >
      <Text className="text-fg-2 text-xs font-medium">{label}</Text>
      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} entfernen`}
          onPress={onRemove}
          hitSlop={8}
        >
          <X size={12} color={c.fg3} />
        </Pressable>
      )}
    </Wrapper>
  );
}

export type DeltaProps = {
  value: number;
  unit?: string;
  direction?: 'up' | 'down' | 'flat';
  format?: 'percent' | 'absolute';
};

export function Delta({ value, unit, direction, format = 'percent' }: DeltaProps) {
  const dir = direction ?? (value > 0 ? 'up' : value < 0 ? 'down' : 'flat');
  const sign = value > 0 ? '+' : '';
  const u = unit ?? (format === 'percent' ? ' %' : '');
  return (
    <View
      className={cn(
        'self-start rounded-full px-2 py-[3px]',
        dir === 'up' && 'bg-success/10',
        dir === 'down' && 'bg-danger/10',
        dir === 'flat' && 'bg-subtle'
      )}
    >
      <Text
        className={cn(
          'font-mono text-xs font-semibold',
          dir === 'up' && 'text-success-fg',
          dir === 'down' && 'text-danger-fg',
          dir === 'flat' && 'text-fg-3'
        )}
      >
        {dir === 'flat' && value === 0 ? '±0' : `${sign}${value}`}
        {u}
      </Text>
    </View>
  );
}

export type CountProps = { count: number; max?: number; variant?: 'number' | 'unseen-dot' };

export function Count({ count, max = 9, variant = 'number' }: CountProps) {
  if (variant === 'unseen-dot') {
    return count > 0 ? (
      <View accessibilityLabel={`${count} ungelesen`} className="bg-accent h-2 w-2 rounded-full" />
    ) : null;
  }
  if (count <= 0) return null;
  return <Text className="text-fg-3 font-mono text-xs">{count > max ? `${max}+` : count}</Text>;
}
