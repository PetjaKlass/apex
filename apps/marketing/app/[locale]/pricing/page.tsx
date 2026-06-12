import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SiteFooter, SiteHeader } from '@/components/site';

export const metadata: Metadata = { title: 'Apex — Pricing' };

const PLANS = ['free', 'solo', 'duo'] as const;

export default function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('marketing.pricing');

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <h1 className="font-display text-fg-1 text-center text-3xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-fg-2 mt-3 text-center text-base">{t('subtitle')}</p>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const popular = plan === 'solo';
            return (
              <article
                key={plan}
                className={`bg-card shadow-card-edge dark:border-border relative flex flex-col rounded-xl p-8 dark:border ${
                  popular ? 'border-accent-border shadow-panel-edge border' : ''
                }`}
              >
                {popular && (
                  <span className="bg-accent text-2xs text-accent-on absolute -top-3 left-8 rounded-full px-3 py-1 font-semibold uppercase tracking-widest">
                    {t('popular')}
                  </span>
                )}
                <h2 className="font-display text-fg-1 text-lg font-semibold">
                  {t(`${plan}.name`)}
                </h2>
                <p className="text-fg-3 mt-1 text-sm">{t(`${plan}.tagline`)}</p>
                <p className="mt-6">
                  <span className="text-fg-1 font-mono text-4xl font-semibold tracking-tight">
                    {t(`${plan}.price`)}
                  </span>
                  <span className="text-fg-2 ml-1 text-sm">{t('perMonth')}</span>
                </p>
                {plan !== 'free' && (
                  <p className="text-fg-3 mt-1 text-xs">
                    {t('orAnnual', { price: t(`${plan}.annual`) })}
                  </p>
                )}
                <ul className="mt-6 flex-1 space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <li key={i} className="text-fg-2 flex items-start gap-2 text-sm">
                      <Check size={15} className="text-accent mt-0.5 shrink-0" aria-hidden />
                      {t(`${plan}.features.${i}`)}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`mt-8 rounded-full px-6 py-3 text-center text-sm font-semibold ${
                    popular
                      ? 'bg-accent text-accent-on shadow-card-edge hover:brightness-105'
                      : 'border-border bg-card text-fg-1 shadow-card-edge hover:bg-hover border'
                  }`}
                >
                  {t('cta', { plan: t(`${plan}.name`) })}
                </Link>
              </article>
            );
          })}
        </div>
        <p className="text-fg-3 mt-8 text-center text-xs">{t('note')}</p>
      </main>
      <SiteFooter />
    </>
  );
}
