import { Pressable, Text } from 'react-native';
import { cn } from '@apex/ui';

/** Auswahlkarte für die Identitäts-Frage. Aktiv = Akzent-Rahmen + Glow (S2). */
export function IdentityCard({
  label,
  description,
  selected,
  onPress,
}: {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}. ${description}`}
      onPress={onPress}
      className={cn(
        'rounded-lg border p-4',
        'web:transition-transform web:duration-fast web:hover:-translate-y-0.5 web:cursor-pointer',
        selected
          ? 'bg-accent-dim border-accent-border shadow-card-edge'
          : 'bg-card border-border shadow-card-edge web:hover:border-border-strong'
      )}
    >
      <Text className={cn('text-sm font-semibold', selected ? 'text-accent-text' : 'text-fg-1')}>
        {label}
      </Text>
      <Text className={cn('mt-1 text-xs', selected ? 'text-accent-text opacity-80' : 'text-fg-3')}>
        {description}
      </Text>
    </Pressable>
  );
}
