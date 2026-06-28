import { Link } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { cn } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import type { NavEntry } from './nav';

/** Sidebar-Eintrag. Aktiv = opake Karte + Akzent-Icon (S2: ein Goldsignal). */
export function NavItem({
  entry,
  active,
  collapsed,
  onPress,
}: {
  entry: NavEntry;
  active: boolean;
  collapsed?: boolean;
  onPress?: () => void;
}) {
  const t = useT();
  const { colors } = useTheme();
  const Icon = entry.icon;
  return (
    <Link href={entry.href as never} asChild onPress={onPress}>
      <Pressable
        accessibilityRole="link"
        accessibilityState={{ selected: active }}
        accessibilityLabel={t(`nav.${entry.key}`)}
        className={cn(
          'min-h-[40px] flex-row items-center gap-3 rounded-[13px] px-3 py-2',
          collapsed && 'justify-center px-3',
          active ? 'bg-card shadow-card-edge' : 'active:bg-hover'
        )}
      >
        <Icon size={17} color={active ? colors.accent.base : colors.fg2} />
        {!collapsed && (
          <Text
            className={cn('tracking-snug text-sm font-medium', active ? 'text-fg-1' : 'text-fg-2')}
          >
            {t(`nav.${entry.key}`)}
          </Text>
        )}
      </Pressable>
    </Link>
  );
}
