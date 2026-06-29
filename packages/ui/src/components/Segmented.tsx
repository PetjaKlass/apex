/**
 * Segmented — moderne Auswahl für 2–3 kurze Optionen (Prototyp `.segment`).
 * Subtiler Pillen-Track; aktives Segment = weiße Karte, die per Animation zur
 * gewählten Option GLEITET (statt hartem Umschalten). Cross-platform via Animated.
 */
import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, Pressable, Text, View } from 'react-native';
import { cn } from '../cn';
import { tapLight } from '../haptics';

export type SegmentedOption = { value: string; label: string };

export type SegmentedProps = {
  legend?: string;
  legendHidden?: boolean;
  options: SegmentedOption[];
  value: string | null;
  onChange: (value: string) => void;
};

const PAD = 4;

export function Segmented({ legend, legendHidden, options, value, onChange }: SegmentedProps) {
  const n = options.length;
  const idx = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );
  const [width, setWidth] = useState(0);
  const seg = width > 0 ? (width - PAD * 2) / n : 0;
  const [tx] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(tx, {
      toValue: idx * seg,
      duration: 240,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1), // leicht überschwingend, „springy"
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [idx, seg, tx]);

  return (
    <View>
      {legend && (
        <Text
          className={cn(
            'text-2xs text-fg-2 mb-2 font-semibold',
            legendHidden && 'sr-only h-0 opacity-0'
          )}
        >
          {legend}
        </Text>
      )}
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        className="bg-subtle border-border relative flex-row rounded-full border p-1"
        accessibilityRole={Platform.OS === 'web' ? ('radiogroup' as never) : undefined}
      >
        {seg > 0 && value !== null && (
          <Animated.View
            style={{
              position: 'absolute',
              top: PAD,
              bottom: PAD,
              left: PAD,
              width: seg,
              transform: [{ translateX: tx }],
              pointerEvents: 'none',
            }}
            className="bg-card shadow-card rounded-full"
          />
        )}
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={opt.label}
              onPress={() => {
                if (!selected) {
                  tapLight();
                  onChange(opt.value);
                }
              }}
              style={{ zIndex: 1 }}
              className="min-h-[38px] flex-1 items-center justify-center rounded-full px-3 py-2"
            >
              <Text
                className={cn('text-xs font-medium', selected ? 'text-fg-1' : 'text-fg-2')}
                numberOfLines={1}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
