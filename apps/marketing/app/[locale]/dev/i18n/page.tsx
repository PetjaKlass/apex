'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { formatCurrency, formatDate, formatNumber, type Locale } from '@apex/i18n';
import { Link, usePathname } from '@/i18n/navigation';

export default function I18nTestPage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [count, setCount] = useState(1);
  const other = locale === 'de' ? 'en' : 'de';
  const now = new Date();

  return (
    <main className="mx-auto min-h-screen max-w-2xl p-8">
      <p className="text-2xs text-fg-3 font-semibold uppercase tracking-widest">
        {t('dev.i18nTitle')}
      </p>
      <h1 className="font-display mt-2 text-2xl font-bold tracking-tight">
        {t('greeting.morning', { name: 'Petja' })}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={pathname}
          locale={other}
          className="bg-accent text-accent-on shadow-card-edge h-9 rounded-full px-5 text-sm font-semibold leading-9"
        >
          {t('dev.switchLocale')}
        </Link>
        <span className="text-fg-2 text-sm">
          Locale: <span className="font-mono">{locale}</span>
        </span>
      </div>

      <div className="bg-card shadow-card-edge mt-8 rounded-lg p-6">
        <h2 className="text-fg-1 text-sm font-semibold">Plural (ICU)</h2>
        <div className="mt-3 flex items-center gap-3">
          <button
            className="bg-subtle shadow-edge h-9 w-9 rounded-full font-mono"
            onClick={() => setCount((c) => Math.max(0, c - 1))}
          >
            −
          </button>
          <span className="min-w-32 text-center font-mono text-base">
            {t('tasks.count', { count })}
          </span>
          <button
            className="bg-subtle shadow-edge h-9 w-9 rounded-full font-mono"
            onClick={() => setCount((c) => c + 1)}
          >
            +
          </button>
        </div>

        <h2 className="text-fg-1 mt-6 text-sm font-semibold">Intl-Formate</h2>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-fg-2">{t('dev.sampleDate')}</dt>
          <dd className="font-mono">{formatDate(now, locale)}</dd>
          <dt className="text-fg-2">{t('dev.sampleNumber')}</dt>
          <dd className="font-mono">{formatNumber(1234.56, locale)}</dd>
          <dt className="text-fg-2">{t('dev.sampleCurrency')}</dt>
          <dd className="font-mono">
            {formatCurrency(12, locale, locale === 'de' ? 'EUR' : 'USD')}
          </dd>
        </dl>

        <h2 className="text-fg-1 mt-6 text-sm font-semibold">Voice-Check (DE-Umlaute)</h2>
        <p className="text-fg-2 mt-2 text-sm">
          {t('common.delete')} · {t('common.close')} · {t('status.offline')}
        </p>
      </div>
    </main>
  );
}
