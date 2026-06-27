import {
  BookOpen,
  LayoutDashboard,
  ListChecks,
  Repeat,
  Settings,
  Sparkles,
  SquarePen,
  Target,
  Telescope,
} from 'lucide-react-native';

export type NavEntry = {
  key: string;
  href: `/${string}`;
  icon: typeof LayoutDashboard;
  section?: string;
};

/** Reihenfolge + Sektionen aus design-system v4.1 (Sidebar-Layout). i18n-Key = nav.<key>. */
export const NAV: NavEntry[] = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'tasks', href: '/tasks', icon: ListChecks },
  { key: 'habits', href: '/habits', icon: Repeat },
  { key: 'goals', href: '/goals', icon: Target, section: 'direction' },
  { key: 'vision', href: '/vision', icon: Telescope },
  { key: 'journal', href: '/journal', icon: SquarePen, section: 'reflection' },
  { key: 'knowledge', href: '/knowledge', icon: BookOpen },
  { key: 'settings', href: '/settings', icon: Settings, section: 'system' },
];

/** Mobile-Dock: 5 Kernziele (Rest über „Mehr" im Profil/Drawer). */
export const DOCK_KEYS = ['dashboard', 'tasks', 'habits', 'journal', 'settings'];
export const ICONS = { Sparkles };
