import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Avatar, Modal } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { useWorkspace } from '@/lib/workspace';

export function WorkspaceSwitcher({ collapsed }: { collapsed?: boolean }) {
  const { workspaces, active, setActive } = useWorkspace();
  const { colors } = useTheme();
  const t = useT();
  const [open, setOpen] = useState(false);
  const label = active?.name ?? '…';

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('shell.workspace')}: ${label}`}
        onPress={() => workspaces.length > 1 && setOpen(true)}
        className="border-border bg-card-glass shadow-edge active:bg-hover flex-row items-center gap-3 rounded-[12px] border px-3 py-2"
      >
        <Avatar name={label} size="sm" />
        {!collapsed && (
          <View className="flex-1">
            <Text className="text-fg-1 text-sm font-medium" numberOfLines={1}>
              {label}
            </Text>
            <Text className="text-fg-3 text-xs capitalize">
              {active?.type ?? 'solo'} · {active?.plan ?? 'free'}
            </Text>
          </View>
        )}
      </Pressable>

      <Modal
        visible={open}
        variant="sheet"
        title={t('shell.workspace')}
        onClose={() => setOpen(false)}
      >
        <View className="gap-1">
          {workspaces.map((w) => (
            <Pressable
              key={w.id}
              accessibilityRole="button"
              accessibilityState={{ selected: w.id === active?.id }}
              onPress={() => {
                setActive(w.id);
                setOpen(false);
              }}
              className="active:bg-hover flex-row items-center gap-3 rounded-[12px] px-3 py-3"
            >
              <Avatar name={w.name} size="sm" />
              <Text className="text-fg-1 flex-1 text-sm">{w.name}</Text>
              {w.id === active?.id && <Check size={16} color={colors.accent.base} />}
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
}
