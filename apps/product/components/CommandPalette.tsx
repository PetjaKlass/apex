/** Command Palette — ⌘K / Ctrl+K (Web). Suche + Schnell-Aufgabe. Glas-Pop-Ebene. */
import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Plus, Search } from 'lucide-react-native';
import { Modal } from '@apex/ui';
import { useT } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

export function CommandPalette({ onAddTask }: { onAddTask: (title: string) => void }) {
  const t = useT();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submit = () => {
    if (q.trim()) {
      onAddTask(q.trim());
      setQ('');
      setOpen(false);
    }
  };

  return (
    <Modal visible={open} variant="dialog" onClose={() => setOpen(false)}>
      <View className="border-border flex-row items-center gap-3 border-b pb-3">
        <Search size={18} color={colors.fg2} />
        {Platform.OS === 'web' ? (
          // echtes Input für sofortigen Fokus + Enter
          <input
            autoFocus
            value={q}
            placeholder={t('dashboard.quickAdd')}
            onChange={(e) => setQ((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            style={{
              flex: 1,
              outline: 'none',
              background: 'transparent',
              color: colors.fg1,
              fontSize: 15,
            }}
          />
        ) : (
          <Text className="text-fg-3 flex-1 text-sm">{t('dashboard.quickAdd')}</Text>
        )}
      </View>
      {q.trim().length > 0 && (
        <Pressable
          onPress={submit}
          className="active:bg-hover mt-2 flex-row items-center gap-3 rounded-[12px] px-3 py-3"
        >
          <Plus size={16} color={colors.accent.base} />
          <Text className="text-fg-1 text-sm">{t('dashboard.addTask', { q: q.trim() })}</Text>
        </Pressable>
      )}
    </Modal>
  );
}
