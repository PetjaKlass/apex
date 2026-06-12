import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Link } from '@/i18n/navigation';
import { AuthShell, Field, SubmitButton } from '../auth-shell';

export const metadata: Metadata = { title: 'Apex — Reset password' };

export default function ResetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('marketing.auth');
  return (
    <AuthShell
      title={t('resetTitle')}
      footer={
        <Link href="/sign-in" className="text-accent-text font-semibold hover:underline">
          {t('signIn')}
        </Link>
      }
    >
      <form className="space-y-4">
        <Field label={t('email')} type="email" autoComplete="email" />
        <SubmitButton label={t('reset')} />
      </form>
    </AuthShell>
  );
}
