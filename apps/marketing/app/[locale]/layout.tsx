import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { cssVariablesAll } from '@apex/design-tokens';
import { locales } from '@apex/i18n';
import { Providers } from '@/components/theme';
import { routing } from '@/i18n/routing';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Apex',
  description: 'Life Operating System for Solo Founders and Duos',
  alternates: {
    languages: { en: '/en', de: '/de', 'x-default': '/en' }, // hreflang für SEO
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Pre-Paint: Akzent aus localStorage setzen, bevor gerendert wird (kein Flash).
const accentScript = `(function(){try{var a=localStorage.getItem('apex-accent');if(a)document.documentElement.setAttribute('data-accent',a);}catch(e){}})();`;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} data-accent="gold" suppressHydrationWarning>
      <head>
        <style id="apex-tokens" dangerouslySetInnerHTML={{ __html: cssVariablesAll }} />
        <script dangerouslySetInnerHTML={{ __html: accentScript }} />
      </head>
      <body className="antialiased">
        <Providers>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
