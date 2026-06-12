/** RadioGroup — Kreis 20/Punkt 8, Pfeiltasten-Navigation (Web), allowDeselect opt-in (radio.md). */
import { useRef } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { cn } from '../cn';
import { tapLight } from '../haptics';

export type RadioOption = { value: string; label: string; sublabel?: string; disabled?: boolean };

export type RadioGroupProps = {
  legend: string;
  legendHidden?: boolean;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  allowDeselect?: boolean;
  error?: string;
  disabled?: boolean;
};

export function RadioGroup({
  legend,
  legendHidden = false,
  options,
  value,
  onChange,
  allowDeselect = false,
  error,
  disabled = false,
}: RadioGroupProps) {
  const refs = useRef<Array<{ focus?: () => void } | null>>([]);

  const enabled = options.map((o, i) => ({ ...o, i })).filter((o) => !o.disabled && !disabled);
  const move = (fromIdx: number, dir: 1 | -1) => {
    if (enabled.length === 0) return;
    const pos = enabled.findIndex((o) => o.i === fromIdx);
    const next = enabled[(pos + dir + enabled.length) % enabled.length];
    if (next) {
      onChange(next.value);
      refs.current[next.i]?.focus?.();
    }
  };

  return (
    <View accessibilityRole={Platform.OS === 'web' ? ('radiogroup' as never) : undefined}>
      <Text
        className={cn(
          'text-2xs text-fg-2 mb-2 font-semibold',
          legendHidden && 'sr-only h-0 opacity-0'
        )}
      >
        {legend}
      </Text>
      <View className="gap-3">
        {options.map((opt, i) => {
          const selected = value === opt.value;
          const isDisabled = disabled || opt.disabled;
          return (
            <Pressable
              key={opt.value}
              ref={(r) => {
                refs.current[i] = r as never;
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, disabled: isDisabled }}
              accessibilityLabel={opt.sublabel ? `${opt.label}. ${opt.sublabel}` : opt.label}
              disabled={isDisabled}
              onPress={() => {
                tapLight();
                if (selected && allowDeselect) onChange('');
                else if (!selected) onChange(opt.value);
              }}
              {...(Platform.OS === 'web'
                ? {
                    onKeyDown: (e: { key: string; preventDefault(): void }) => {
                      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        move(i, 1);
                      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        move(i, -1);
                      }
                    },
                  }
                : {})}
              hitSlop={6}
              className={cn(
                'min-h-[44px] flex-row items-start gap-3 py-1.5',
                isDisabled && 'opacity-40'
              )}
            >
              <View
                className={cn(
                  'mt-0.5 h-5 w-5 items-center justify-center rounded-full border-[1.5px]',
                  selected ? 'border-accent' : 'border-border-strong'
                )}
              >
                {selected && <View className="bg-accent h-2 w-2 rounded-full" />}
              </View>
              <View className="flex-1">
                <Text className="text-fg-1 text-sm">{opt.label}</Text>
                {opt.sublabel && <Text className="text-fg-3 text-xs">{opt.sublabel}</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>
      {error && (
        <Text
          className="text-danger-fg mt-2 text-xs"
          {...(Platform.OS === 'web' ? { role: 'alert' } : {})}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
