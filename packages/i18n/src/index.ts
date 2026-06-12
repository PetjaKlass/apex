import de from '../messages/de.json';
import en from '../messages/en.json';

export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export type Messages = typeof en;
export const messages: Record<Locale, Messages> = { en, de };

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export * from './format';
export * from './translate';
