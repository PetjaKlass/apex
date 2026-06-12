import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('common');

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="bg-accent mb-6 h-12 w-0.5 rounded-full" />
        <h1 className="font-display text-fg-1 text-4xl font-bold tracking-tight">{t('appName')}</h1>
        <p className="text-fg-2 mt-3 max-w-sm text-base">{t('tagline')}</p>
      </div>
    </main>
  );
}
