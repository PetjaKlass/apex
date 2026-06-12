import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LocaleThemeControls } from './site-client';

/** Goldener Faden — S1: hier als Markenzeichen im Header/Hero erlaubt (Marketing = Schaufenster). */
export function GoldThread({ className = 'h-10' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`from-accent-bright via-accent block w-0.5 rounded-full bg-gradient-to-b to-transparent ${className}`}
    />
  );
}

export function SiteHeader() {
  const t = useTranslations('marketing.nav');
  return (
    <header className="z-sticky border-border bg-canvas/85 sticky top-0 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-3">
          <GoldThread className="h-6" />
          <span className="font-display text-fg-1 text-base font-bold tracking-tight">APEX</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link
            href="/pricing"
            className="text-fg-2 hover:bg-hover hover:text-fg-1 rounded-full px-3 py-2 text-sm font-medium"
          >
            {t('pricing')}
          </Link>
          <Link
            href="/sign-in"
            className="text-fg-2 hover:bg-hover hover:text-fg-1 hidden rounded-full px-3 py-2 text-sm font-medium sm:block"
          >
            {t('signIn')}
          </Link>
          <Link
            href="/sign-up"
            className="bg-accent text-accent-on shadow-card-edge rounded-full px-4 py-2 text-sm font-semibold hover:brightness-105"
          >
            {t('getStarted')}
          </Link>
          <LocaleThemeControls />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const t = useTranslations('marketing');
  return (
    <footer className="border-border border-t">
      <div className="text-fg-3 mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm sm:flex-row sm:items-center">
        <p>
          <span className="font-display text-fg-2 font-bold">APEX</span> — {t('footer.tagline')}
        </p>
        <nav className="flex gap-4 sm:ml-auto">
          <Link href="/imprint" className="hover:text-fg-1">
            {t('legal.imprint')}
          </Link>
          <Link href="/privacy" className="hover:text-fg-1">
            {t('legal.privacy')}
          </Link>
          <Link href="/terms" className="hover:text-fg-1">
            {t('legal.terms')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export function LegalPage({ title, draft, body }: { title: string; draft: string; body: string }) {
  return (
    <main className="mx-auto min-h-[60vh] max-w-2xl px-6 py-16">
      <h1 className="font-display text-fg-1 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="border-border bg-subtle text-warning-fg shadow-edge mt-4 rounded-sm border px-4 py-3 text-xs font-medium">
        {draft}
      </p>
      <p className="text-fg-2 mt-6 text-base leading-relaxed">{body}</p>
    </main>
  );
}
