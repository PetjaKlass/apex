/** Toggle — 44×26, Knob 20, springy 200ms; optimistisch mit Revert bei Promise-Fehler (toggle.md). */
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, Text, View } from 'react-native';
import { cn } from '../cn';
import { tapLight } from '../haptics';
import { useUiColors } from '../theme';

export type ToggleProps = {
  value: boolean;
  onToggle: (next: boolean) => void | Promise<void>;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  loading?: boolean;
};

export function Toggle({ value, onToggle, label, sublabel, disabled, loading }: ToggleProps) {
  const c = useUiColors();
  const [optimistic, setOptimistic] = useState(value);
  const [busy, setBusy] = useState(false);
  useEffect(() => setOptimistic(value), [value]);

  const x = useRef(new Animated.Value(value ? 18 : 0)).current;
  useEffect(() => {
    Animated.timing(x, {
      toValue: optimistic ? 18 : 0,
      duration: 200,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      useNativeDriver: true,
    }).start();
  }, [optimistic, x]);

  const blocked = disabled || loading || busy;

  const handle = async () => {
    if (blocked) return;
    tapLight();
    const next = !optimistic;
    setOptimistic(next); // optimistisch …
    try {
      setBusy(true);
      await onToggle(next);
    } catch {
      setOptimistic(!next); // … mit Revert (toggle.md)
    } finally {
      setBusy(false);
    }
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: optimistic, disabled: blocked, busy: loading || busy }}
      accessibilityLabel={sublabel ? `${label}. ${sublabel}` : label}
      disabled={blocked}
      onPress={() => void handle()}
      hitSlop={8}
      className={cn('min-h-[44px] flex-row items-center gap-3 py-2', disabled && 'opacity-40')}
    >
      <View
        className={cn(
          'shadow-edge h-[26px] w-[44px] justify-center rounded-full p-[3px]',
          optimistic ? 'bg-accent' : 'bg-pressed'
        )}
      >
        <Animated.View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
            transform: [{ translateX: x }],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {(loading || busy) && (
            <ActivityIndicator size={12 as unknown as 'small'} color={c.accent} />
          )}
        </Animated.View>
      </View>
      <View className="flex-1">
        <Text className="text-fg-1 text-sm">{label}</Text>
        {sublabel && <Text className="text-fg-3 text-xs">{sublabel}</Text>}
      </View>
    </Pressable>
  );
}
