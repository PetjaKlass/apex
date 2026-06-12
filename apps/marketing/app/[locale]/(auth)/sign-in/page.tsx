import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Link } from '@/i18n/navigation';
import { AuthShell, Field, SubmitButton } from '../auth-shell';

export const metadata: Metadata = { title: 'Apex — Sign in' };

export default function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('marketing.auth');
  return (
    <AuthShell
      title={t('signInTitle')}
      footer={
        <>
          {t('noAccount')}{' '}
          <Link href="/sign-up" className="text-accent-text font-semibold hover:underline">
            {t('signUp')}
          </Link>
        </>
      }
    >
      <form className="space-y-4">
        <Field label={t('email')} type="email" autoComplete="email" />
        <Field label={t('password')} type="password" autoComplete="current-password" />
        <SubmitButton label={t('signIn')} />
        <p className="text-center">
          <Link href="/reset-password" className="text-fg-3 hover:text-fg-1 text-xs">
            {t('forgot')}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
