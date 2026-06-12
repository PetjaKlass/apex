import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Link } from '@/i18n/navigation';
import { AuthForm } from '@/components/auth-form';
import { AuthShell } from '../auth-shell';

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
      <AuthForm mode="sign-in" />
      <p className="mt-4 text-center">
        <Link href="/reset-password" className="text-fg-3 hover:text-fg-1 text-xs">
          {t('forgot')}
        </Link>
      </p>
    </AuthShell>
  );
}
