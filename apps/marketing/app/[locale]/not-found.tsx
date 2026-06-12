import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { GoldThread } from '@/components/site';

export default function NotFound() {
  const t = useTranslations('marketing.notFound');
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <GoldThread className="h-10 opacity-40" />
      <h1 className="font-display text-fg-1 mt-6 text-2xl font-bold tracking-tight">
        {t('title')}
      </h1>
      <p className="text-fg-2 mt-2 text-base">{t('body')}</p>
      <Link
        href="/"
        className="border-border bg-card text-fg-1 shadow-card-edge hover:bg-hover mt-8 rounded-full border px-6 py-3 text-sm font-semibold"
      >
        {t('cta')}
      </Link>
    </main>
  );
}
