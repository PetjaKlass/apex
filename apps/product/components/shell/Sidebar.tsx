import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { useT } from '@/lib/i18n';
import { NAV } from './nav';
import { NavItem } from './NavItem';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

/** Schwebendes Glas-Panel (design-system v4.1). Auf Tablet (Icon-Rail) collapsed. */
export function Sidebar({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const t = useT();
  return (
    <View
      className="border-panel-border bg-panel shadow-panel-edge web:backdrop-blur-2xl h-full rounded-xl border p-3"
      style={collapsed ? { width: 72 } : undefined}
    >
      <View className="mb-5 flex-row items-center gap-3 px-3 pt-2">
        <View className="from-accent-bright via-accent h-7 w-0.5 rounded-full bg-gradient-to-b to-transparent" />
        {!collapsed && (
          <Text className="font-display text-fg-1 text-base font-bold tracking-tight">APEX</Text>
        )}
      </View>

      <View className="flex-1 gap-0.5">
        {NAV.map((entry) => (
          <Fragment key={entry.key}>
            {entry.section && !collapsed && (
              <Text className="text-2xs text-fg-3 px-3 pb-1 pt-4 font-semibold uppercase tracking-widest">
                {t(`nav.sections.${entry.section}`)}
              </Text>
            )}
            <NavItem
              entry={entry}
              active={pathname.startsWith(entry.href)}
              collapsed={collapsed}
              onPress={onNavigate}
            />
          </Fragment>
        ))}
      </View>

      <View className="border-border border-t pt-2">
        <WorkspaceSwitcher collapsed={collapsed} />
      </View>
    </View>
  );
}
