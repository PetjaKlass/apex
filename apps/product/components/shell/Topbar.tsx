import { Pressable, Text, View } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { Count } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { ProfileMenu } from './ProfileMenu';

export function Topbar({
  title,
  onMenu,
  showMenu,
}: {
  title: string;
  onMenu?: () => void;
  showMenu?: boolean;
}) {
  const { colors } = useTheme();
  const t = useT();
  return (
    <View className="border-border h-[60px] flex-row items-center gap-3 border-b px-4 sm:px-6">
      {showMenu && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('shell.menu')}
          onPress={onMenu}
          hitSlop={8}
          className="active:bg-hover h-9 w-9 items-center justify-center rounded-full lg:hidden"
        >
          <Menu size={18} color={colors.fg1} />
        </Pressable>
      )}
      <Text className="tracking-snug text-fg-2 text-sm font-semibold">{title}</Text>
      <View className="ml-auto flex-row items-center gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('shell.notifications')}
          className="border-border bg-card-glass shadow-edge active:bg-hover h-9 w-9 items-center justify-center rounded-full border"
        >
          <Bell size={16} color={colors.fg2} />
          <View className="absolute right-1.5 top-1.5">
            <Count count={0} variant="unseen-dot" />
          </View>
        </Pressable>
        <ProfileMenu />
      </View>
    </View>
  );
}
