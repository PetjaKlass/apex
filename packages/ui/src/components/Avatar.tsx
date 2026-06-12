/** Avatar — Initialen-Pflicht, self=Accent-Gradient, deterministische Pastell-Palette (avatar.md). */
import { Platform, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '../cn';
import { avatarPalette, initialsOf, useUiColors } from '../theme';

export type AvatarProps = {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  self?: boolean;
  status?: 'online' | 'offline';
  onPress?: () => void;
};

const SIZE = {
  xs: { box: 24, text: 'text-2xs' },
  sm: { box: 28, text: 'text-2xs' },
  md: { box: 32, text: 'text-xs' },
  lg: { box: 40, text: 'text-sm' },
  xl: { box: 64, text: 'text-lg' },
} as const;

export function Avatar({ name, size = 'md', self = false, status, onPress }: AvatarProps) {
  const c = useUiColors();
  const s = SIZE[size];
  const initials = initialsOf(name);
  const pal = avatarPalette(name, c.theme);

  const core = self ? (
    <LinearGradient
      colors={[c.accentBright, c.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: s.box,
        height: s.box,
        borderRadius: s.box / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text className={cn('font-semibold', s.text)} style={{ color: c.accentOn }}>
        {initials}
      </Text>
    </LinearGradient>
  ) : (
    <View
      style={{ width: s.box, height: s.box, borderRadius: s.box / 2, backgroundColor: pal.bg }}
      className="items-center justify-center"
    >
      <Text className={cn('font-semibold', s.text)} style={{ color: pal.fg }}>
        {initials}
      </Text>
    </View>
  );

  const withStatus = (
    <View style={{ width: s.box, height: s.box }}>
      {core}
      {status && (
        <View
          className={cn(
            'border-canvas absolute -bottom-px -right-px rounded-full border-2',
            status === 'online' ? 'bg-success' : 'bg-onhold'
          )}
          style={{ width: 10, height: 10 }}
        />
      )}
    </View>
  );

  const label = `Avatar von ${name}${status ? `, ${status === 'online' ? 'online' : 'offline'}` : ''}`;
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
        {withStatus}
      </Pressable>
    );
  }
  return (
    <View
      accessibilityRole={Platform.OS === 'web' ? ('img' as never) : 'image'}
      accessibilityLabel={label}
    >
      {withStatus}
    </View>
  );
}

/** Überlappende Gruppe: max 4 sichtbar + „+N" (avatar.md). */
export function AvatarGroup({
  names,
  size = 'sm',
}: {
  names: string[];
  size?: AvatarProps['size'];
}) {
  const visible = names.slice(0, 4);
  const rest = names.length - visible.length;
  return (
    <View className="flex-row items-center">
      {visible.map((n, i) => (
        <View key={n + i} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: i + 1 }}>
          <Avatar name={n} size={size} />
        </View>
      ))}
      {rest > 0 && (
        <View style={{ marginLeft: -8, zIndex: 9 }}>
          <View className="border-border bg-subtle h-7 w-7 items-center justify-center rounded-full border">
            <Text className="text-2xs text-fg-2 font-mono">+{rest}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
