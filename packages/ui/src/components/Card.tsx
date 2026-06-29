/**
 * Card — Layer-2-Fläche (docs/design-system/components/card.md).
 * Opak, Schatten + Lichtkante. Light borderless, Dark Hairline. hoverable NUR mit onPress.
 */
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { cn } from '../cn';
import { tapLight } from '../haptics';

export type CardVariant = 'default' | 'hoverable' | 'subtle';

export type CardProps = {
  variant?: CardVariant;
  header?: string;
  hint?: string;
  footer?: React.ReactNode;
  scrollable?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Card({
  variant = 'default',
  header,
  hint,
  footer,
  scrollable = false,
  onPress,
  accessibilityLabel,
  disabled = false,
  className,
  children,
}: CardProps) {
  const interactive = Boolean(onPress) && !disabled && variant !== 'subtle';
  if (onPress && !accessibilityLabel && process.env.NODE_ENV !== 'production') {
    console.warn('[Card] onPress verlangt accessibilityLabel (card.md).');
  }

  const surface = cn(
    'rounded-lg p-4 sm:p-6',
    variant === 'subtle'
      ? 'bg-subtle border border-hairline shadow-edge'
      : 'bg-card border border-hairline shadow-card-edge',
    // hoverable: einziger erlaubter Lift — nur Web, nur mit onPress (Agent-Regel aus card.md)
    interactive &&
      'web:transition-transform web:duration-fast web:hover:-translate-y-0.5 web:hover:shadow-panel-edge web:cursor-pointer active:bg-pressed',
    interactive &&
      'web:outline-none web:focus-visible:outline web:focus-visible:outline-2 web:focus-visible:outline-offset-2 web:focus-visible:outline-accent-bright',
    disabled && 'opacity-40',
    className
  );

  const inner = (
    <>
      {header && (
        <View
          className={cn(
            'flex-row items-baseline gap-3',
            // Divider nur wenn Header UND Inhalt (card.md §Verhalten)
            'border-border mb-4 border-b pb-3'
          )}
        >
          <Text className="text-fg-1 text-base font-semibold">{header}</Text>
          {hint && <Text className="text-fg-3 ml-auto text-xs">{hint}</Text>}
        </View>
      )}
      {scrollable ? <ScrollView className="max-h-full">{children}</ScrollView> : children}
      {footer && <View className="mt-4">{footer}</View>}
    </>
  );

  if (interactive) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
        onPress={() => {
          if (Platform.OS !== 'web') tapLight();
          onPress?.();
        }}
        className={surface}
      >
        {inner}
      </Pressable>
    );
  }
  return <View className={surface}>{inner}</View>;
}
