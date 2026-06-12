import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Link } from '@/i18n/navigation';
import { GoldThread, SiteFooter, SiteHeader } from '@/components/site';

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('marketing');

  const features = ['obt', 'identity', 'focus', 'offline'] as const;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-24 text-center">
          <span className="border-border bg-card-glass text-2xs text-fg-3 shadow-edge rounded-full border px-3 py-1 font-semibold uppercase tracking-widest">
            {t('hero.status')}
          </span>
          <GoldThread className="mt-10 h-12" />
          <p className="text-2xs text-accent-text mt-6 font-semibold uppercase tracking-widest">
            {t('hero.eyebrow')}
          </p>
          <h1 className="font-display text-fg-1 mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {t('hero.title')}
          </h1>
          <p className="text-fg-2 mt-5 max-w-xl text-lg">{t('hero.subtitle')}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="bg-accent text-accent-on shadow-card-edge rounded-full px-8 py-3 text-sm font-semibold hover:brightness-105"
            >
              {t('hero.ctaPrimary')}
            </Link>
            <Link
              href="/pricing"
              className="border-border bg-card text-fg-1 shadow-card-edge hover:bg-hover rounded-full border px-8 py-3 text-sm font-semibold"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-24 sm:grid-cols-2">
          {features.map((key) => (
            <article
              key={key}
              className="bg-card shadow-card-edge dark:border-border rounded-lg p-6 dark:border"
            >
              <h2 className="font-display text-fg-1 text-lg font-semibold tracking-tight">
                {t(`features.${key}.title`)}
              </h2>
              <p className="text-fg-2 mt-2 text-sm leading-relaxed">{t(`features.${key}.body`)}</p>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
