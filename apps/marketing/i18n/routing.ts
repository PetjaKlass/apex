import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from '@apex/i18n';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always', // /en/* und /de/* — / wird per Accept-Language umgeleitet
});
