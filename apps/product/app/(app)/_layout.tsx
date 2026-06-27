import { Redirect, Slot, usePathname } from 'expo-router';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { WorkspaceProvider } from '@/lib/workspace';
import { MobileDrawer } from '@/components/shell/MobileDrawer';
import { NAV } from '@/components/shell/nav';
import { Sidebar } from '@/components/shell/Sidebar';
import { Topbar } from '@/components/shell/Topbar';

/** Authentifizierte Shell. ≥1024 Desktop-Sidebar · 768-1023 Icon-Rail · <768 Drawer. */
export default function AppLayout() {
  const { session, profile, loading } = useAuth();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const t = useT();
  const [drawer, setDrawer] = useState(false);

  if (!loading && !session) return <Redirect href="/sign-in" />;
  if (!loading && session && profile && !profile.onboarded_at)
    return <Redirect href="/onboarding/welcome" />;

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const activeKey = NAV.find((n) => pathname.startsWith(n.href))?.key ?? 'dashboard';

  return (
    <WorkspaceProvider>
      <SafeAreaView className="bg-canvas flex-1">
        <View className="flex-1 flex-row gap-4 p-2 sm:p-4">
          {(isDesktop || isTablet) && (
            <View style={{ width: isTablet ? 72 : 248 }} className="h-full">
              <Sidebar pathname={pathname} collapsed={isTablet} />
            </View>
          )}

          <View className="border-panel-border bg-panel shadow-panel-edge web:backdrop-blur-2xl flex-1 overflow-hidden rounded-xl border">
            <Topbar
              title={t(`nav.${activeKey}`)}
              showMenu={!isDesktop && !isTablet}
              onMenu={() => setDrawer(true)}
            />
            <View className="flex-1">
              <Slot />
            </View>
          </View>
        </View>

        {!isDesktop && !isTablet && (
          <MobileDrawer open={drawer} onClose={() => setDrawer(false)} pathname={pathname} />
        )}
      </SafeAreaView>
    </WorkspaceProvider>
  );
}
