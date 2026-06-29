/**
 * Segmented — moderne Auswahl für 2–3 kurze Optionen (Prototyp `.segment`).
 * Subtiler Pillen-Track; aktives Segment = weiße Karte mit Schatten. Ersetzt
 * die altmodischen Kreis-Radios für wenige, knappe Optionen (Solo/Duo, Horizont …).
 */
import { Platform, Pressable, Text, View } from 'react-native';
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

export function Segmented({ legend, legendHidden, options, value, onChange }: SegmentedProps) {
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
        className="bg-subtle border-border flex-row gap-1 rounded-full border p-1"
        accessibilityRole={Platform.OS === 'web' ? ('radiogroup' as never) : undefined}
      >
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
              className={cn(
                'min-h-[38px] flex-1 items-center justify-center rounded-full px-3 py-2',
                'web:transition-colors web:duration-fast',
                selected ? 'bg-card shadow-card' : 'web:hover:bg-hover'
              )}
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
