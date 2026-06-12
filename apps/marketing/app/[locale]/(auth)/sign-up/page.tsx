import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Link } from '@/i18n/navigation';
import { AuthForm } from '@/components/auth-form';
import { AuthShell } from '../auth-shell';

export const metadata: Metadata = { title: 'Apex — Sign up' };

export default function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('marketing.auth');
  return (
    <AuthShell
      title={t('signUpTitle')}
      footer={
        <>
          {t('hasAccount')}{' '}
          <Link href="/sign-in" className="text-accent-text font-semibold hover:underline">
            {t('signIn')}
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-up" />
      <p className="text-fg-3 mt-4 text-center text-xs">
        {t.rich('legalHint', {
          terms: (chunks) => (
            <Link key="t" href="/terms" className="hover:text-fg-1 underline">
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link key="p" href="/privacy" className="hover:text-fg-1 underline">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </AuthShell>
  );
}
