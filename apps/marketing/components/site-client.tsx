'use client';

import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import { Moon, Sun } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { useHydrated } from '@/components/theme';

export function LocaleThemeControls() {
  const { resolvedTheme, setTheme } = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const other = locale === 'de' ? 'en' : 'de';

  return (
    <span className="flex items-center gap-1">
      <Link
        href={pathname}
        locale={other}
        aria-label={other === 'de' ? 'Zu Deutsch wechseln' : 'Switch to English'}
        className="text-fg-3 hover:bg-hover hover:text-fg-1 rounded-full px-2 py-2 font-mono text-xs uppercase"
      >
        {other}
      </Link>
      <button
        aria-label="Theme wechseln"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="text-fg-3 hover:bg-hover hover:text-fg-1 flex h-8 w-8 items-center justify-center rounded-full"
      >
        {hydrated && (resolvedTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />)}
      </button>
    </span>
  );
}
