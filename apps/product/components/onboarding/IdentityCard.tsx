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
        'bg-card shadow-card-edge rounded-lg border p-4',
        selected ? 'border-accent-border' : 'border-border'
      )}
    >
      <Text className={cn('text-sm font-semibold', selected ? 'text-accent-text' : 'text-fg-1')}>
        {label}
      </Text>
      <Text className="text-fg-3 mt-1 text-xs">{description}</Text>
    </Pressable>
  );
}
