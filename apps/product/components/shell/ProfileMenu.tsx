import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LogOut, Moon, Sun } from 'lucide-react-native';
import { Avatar, Modal } from '@apex/ui';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

export function ProfileMenu() {
  const { profile, session, signOut } = useAuth();
  const { theme, setTheme, colors } = useTheme();
  const t = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const name = profile?.display_name ?? session?.user.email ?? '?';

  const handleLogout = async () => {
    setOpen(false);
    await signOut(); // erst Session leeren …
    router.replace('/sign-in'); // … dann navigieren (Pitfall #6)
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('shell.menu')}
        onPress={() => setOpen(true)}
      >
        <Avatar name={name} self size="md" />
      </Pressable>

      <Modal visible={open} variant="sheet" title={name} onClose={() => setOpen(false)}>
        <View className="gap-1">
          <Text className="text-fg-3 px-3 pb-2 text-xs">{session?.user.email}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="active:bg-hover min-h-[44px] flex-row items-center gap-3 rounded-[12px] px-3"
          >
            {theme === 'dark' ? (
              <Sun size={17} color={colors.fg2} />
            ) : (
              <Moon size={17} color={colors.fg2} />
            )}
            <Text className="text-fg-1 text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => void handleLogout()}
            className="active:bg-hover min-h-[44px] flex-row items-center gap-3 rounded-[12px] px-3"
          >
            <LogOut size={17} color={colors.status.danger} />
            <Text className="text-danger-fg text-sm">{t('auth.signOut')}</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}
