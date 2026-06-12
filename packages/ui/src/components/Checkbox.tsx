/** Checkbox — eckig r6 (Kreis gehört dem Task-Complete!), inkl. Indeterminate (checkbox.md). */
import { Pressable, Text, View } from 'react-native';
import { Check, Minus } from 'lucide-react-native';
import { cn } from '../cn';
import { tapLight } from '../haptics';
import { useUiColors } from '../theme';

export type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onToggle: (next: boolean) => void;
  label: string;
  sublabel?: string;
  disabled?: boolean;
};

export function Checkbox({
  checked,
  indeterminate = false,
  onToggle,
  label,
  sublabel,
  disabled,
}: CheckboxProps) {
  const c = useUiColors();
  const state = indeterminate ? 'mixed' : checked;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: state, disabled }}
      accessibilityLabel={sublabel ? `${label}. ${sublabel}` : label}
      disabled={disabled}
      onPress={() => {
        tapLight();
        onToggle(indeterminate ? true : !checked);
      }}
      hitSlop={8}
      className={cn('min-h-[44px] flex-row items-start gap-3 py-2', disabled && 'opacity-40')}
    >
      <View
        className={cn(
          'rounded-xs mt-0.5 h-5 w-5 items-center justify-center',
          indeterminate
            ? 'bg-accent-dim border-accent-border border'
            : checked
              ? 'bg-accent'
              : 'border-border-strong border-[1.5px] bg-transparent'
        )}
      >
        {indeterminate ? (
          <Minus size={12} color={c.accent} strokeWidth={2.5} />
        ) : checked ? (
          <Check size={13} color={c.accentOn} strokeWidth={2.5} />
        ) : null}
      </View>
      <View className="flex-1">
        <Text className="text-fg-1 text-sm">{label}</Text>
        {sublabel && <Text className="text-fg-3 text-xs">{sublabel}</Text>}
      </View>
    </Pressable>
  );
}
