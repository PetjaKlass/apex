import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { LegalPage, SiteFooter, SiteHeader } from '@/components/site';

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('marketing.legal');
  return (
    <>
      <SiteHeader />
      <LegalPage title={t('terms')} draft={t('draft')} body={t('termsBody')} />
      <SiteFooter />
    </>
  );
}
